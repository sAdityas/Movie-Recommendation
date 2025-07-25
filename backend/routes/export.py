from flask import Blueprint, request, send_file
from openpyxl import load_workbook
from datetime import date
import os

export = Blueprint('export', __name__)

@export.route('/excel', methods=['POST'])
def export_excel():
    data = request.get_json()

    if not data:
        return {"error": "No ticket data received"}, 400

    # Load Excel template
    template_path = "Invoice.xlsx"
    wb = load_workbook(template_path)
    ws = wb.active

    # Fill data (adjust cell positions according to your template layout)
    ws["A5"] = data.get("title", "")
    ws["B5"] = ", ".join(data.get("seats", [])) if isinstance(data.get("seats"), list) else data.get("seats", "")
    ws["C5"] = f"₹{data.get('price', '')}"
    ws["D5"] = data.get("time", "")
    ws["E5"] = data.get("bookingId", "")

    # Save the modified file
    output_path = "Final_Invoice.xlsx"
    wb.save(output_path)

    return send_file(output_path, as_attachment=True)
