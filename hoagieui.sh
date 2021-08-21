git clone git@github.com:HoagieClub/ui.git
cd ui
rm -rf ../lib/hoagie-ui/*
rm -f pages/index.css
mv -f src/components/Theme/index.css ../pages
mv -f src/components/* ../lib/hoagie-ui/
cd ..
rm -rf ui
