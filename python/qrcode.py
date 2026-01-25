import segno
from datetime import datetime

vcard_data = f"""BEGIN:VCARD
VERSION:3.0
N:Manmeet;Kanwar;;Col.;Kanwar Manmeet Security Agency
FN:Col. Kanwar Manmeet (Kanwar Manmeet Security Agency)
ORG:Kanwar Manmeet Security Agency
TITLE:Founder & CEO
TEL;TYPE=WORK:+919832022222
EMAIL;TYPE=WORK,INTERNET:ceo.kmsa@gmail.com
TZ:Asia/Kolkata
REV:{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}
END:VCARD"""

qr = segno.make(vcard_data, error='M')

qr.save(
    "../img/qr/vcard_qr.svg",
    scale=10,
    border=4,
    dark="#CE9641",
    light=None  # transparent background
)

print("vCard QR code saved as '../img/qr/vcard_qr.svg'")
