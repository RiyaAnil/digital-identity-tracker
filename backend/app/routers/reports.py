from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
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
def get_csv_report(
    username: Optional[str] = Query(None, description="Filter by username. If not provided, returns all accounts"),
    db: Session = Depends(get_db)
):
    query = db.query(Account)
    
    if username:
        accounts = query.filter(Account.username == username).all()
    else:
        accounts = query.all()
    
    if not accounts:
        return {"error": "No accounts found"}

    processed = [process_account(account) for account in accounts]
    csv_data, filename = generate_csv(processed)
    response = StreamingResponse(iter([csv_data]), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename={filename}"
    return response

@router.get("/pdf")
def get_pdf_report(
    username: Optional[str] = Query(None, description="Filter by username. If not provided, returns all accounts"),
    db: Session = Depends(get_db)
):
    query = db.query(Account)
    
    if username:
        accounts = query.filter(Account.username == username).all()
    else:
        accounts = query.all()
    
    if not accounts:
        return {"error": "No accounts found"}

    processed = [process_account(account) for account in accounts]
    file_path, filename = generate_pdf(processed)
    return FileResponse(file_path, filename=filename, media_type="application/pdf")