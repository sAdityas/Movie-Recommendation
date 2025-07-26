from fpdf import FPDF
from datetime import date

# Booking data
ticket_data = {
    "bookingId": "21AA1W34F7C",
    "id": 1,
    "price": 250,
    "seats": ["Right-H2", "Right-H3"],
    "time": "11:30",
    "title": "Sinners",
    "userid": 1
}

class InvoicePDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 18)
        self.set_text_color(0, 0, 80)
        self.cell(0, 10, " Movie Ticket Invoice", ln=True, align="C")
        self.set_draw_color(200, 200, 200)
        self.line(10, 20, 200, 20)
        self.ln(10)

    def footer(self):
        self.set_y(-20)
        self.set_draw_color(200, 200, 200)
        self.line(10, self.get_y(), 200, self.get_y())
        self.set_font("Helvetica", "I", 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, "Thank you for booking with MovieHub ", 0, 0, "C")

# Create PDF
pdf = InvoicePDF()
pdf.add_page()

# Ticket Box
pdf.set_fill_color(245, 245, 245)
pdf.set_draw_color(180, 180, 180)
pdf.set_line_width(0.3)
pdf.set_font("Helvetica", "B", 14)
pdf.set_text_color(0, 0, 0)
pdf.cell(0, 10, " Ticket Details", ln=True)

pdf.ln(4)
pdf.set_font("Helvetica", "", 12)
pdf.set_fill_color(255, 255, 255)

def add_label_value(label, value):
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(40, 10, f"{label}:", 0, 0)
    pdf.set_font("Helvetica", "", 12)
    pdf.cell(0, 10, f"{value}", ln=True)

add_label_value("Movie", ticket_data["title"])
add_label_value("Show Time", ticket_data["time"] + " AM")
add_label_value("Date", str(date.today()))
add_label_value("Seats", ", ".join(ticket_data["seats"]))
add_label_value("Price", f"Rs. {ticket_data['price']}")
add_label_value("Booking ID", ticket_data["bookingId"])

# Save PDF
pdf.output("invoice_ticket.pdf")


