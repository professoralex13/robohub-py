cd server
py -m venv .venv
.venv/Scripts/Activate.ps1
py -m pip install -r requirements.txt
prisma db push

cd ../client
npm install