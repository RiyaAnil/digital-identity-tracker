import csv
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import os

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "../templates")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "../../temp_reports")
os.makedirs(OUTPUT_DIR, exist_ok=True)

env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))


def generate_csv(accounts: list):
    filename = f"report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    filepath = os.path.join(OUTPUT_DIR, filename)

    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Username", "Service", "Risk Score", "Last Active", "Status", "Data Types"])
        for acc in accounts:
            writer.writerow([
                acc["username"],
                acc["service_name"],
                acc["risk_score"],
                acc["last_active"].strftime("%Y-%m-%d %H:%M:%S") if acc["last_active"] else "N/A",
                "Active" if acc["is_active"] else "Inactive",
                acc["data_types"]
            ])

    with open(filepath, "r", encoding="utf-8") as f:
        csv_data = f.read()

    return csv_data, filename


def generate_pdf(accounts: list):
    template = env.get_template("report_template.html")
    generated_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    html_content = template.render(accounts=accounts, generated_time=generated_time)

    filename = f"report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    HTML(string=html_content).write_pdf(filepath)

    return filepath, filename
