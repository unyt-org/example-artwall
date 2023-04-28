import qrcode
URL = "https://artwall.unyt.org"

qr = qrcode.QRCode(version=None, box_size=1, border=0,
                   error_correction=qrcode.constants.ERROR_CORRECT_H)
qr.add_data(URL)
img = qr.make_image(fill_color="black", back_color="white")
img.save("qr_code.png")
matrix = qr.get_matrix()
matrix = '\n'.join([''.join([('1' if cell else '0') for cell in row]) for row in matrix])
print(matrix)