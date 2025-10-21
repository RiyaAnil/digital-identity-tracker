from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.account import Account
from app.services.report_service import generate_csv, generate_pdf

router = APIRouter(prefix="/reports", tags=["Reports"])

def process_account(account: Account):
    risk_score = sum(dt.sensitivity_weight for dt in account.data_types)
    inactive_threshold = datetime.utcnow() - timedelta(days=30)
    is_active = account.last_active >= inactive_threshold if account.last_active else True
    data_type_names = ", ".join(dt.type_name for dt in account.data_types)
    return {
        "username": account.username,
        "service_name": account.service_name,
        "risk_score": risk_score,
        "is_active": is_active,
        "last_active": account.last_active,
        "data_types": data_type_names
    }

@router.get("/csv")
def get_csv_report(db: Session = Depends(get_db)):
    username = "me@example.com"  # hardcoded for now
    account = db.query(Account).filter(Account.username == username).first()
    if not account:
        return {"error": "Account not found"}

    processed = [process_account(account)]
    csv_data, filename = generate_csv(processed)
    response = StreamingResponse(iter([csv_data]), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename={filename}"
    return response

@router.get("/pdf")
def get_pdf_report(db: Session = Depends(get_db)):
    username = "me@example.com"  # hardcoded for now
    account = db.query(Account).filter(Account.username == username).first()
    if not account:
        return {"error": "Account not found"}

    processed = [process_account(account)]
    file_path, filename = generate_pdf(processed)
    return FileResponse(file_path, filename=filename, media_type="application/pdf")
