
```
AgrazMonitoreo - prueba
├─ .dockerignore
├─ app.js
├─ bot.js
├─ controllers
│  ├─ SensorsControllers.js
│  ├─ userControllers.js
│  └─ viewsControllers.js
├─ Dockerfile
├─ handlers
│  └─ errorHandlers.js
├─ midellwares
│  └─ auth.js
├─ models
│  ├─ chatIdTelegram.js
│  ├─ Sensors.js
│  └─ users.js
├─ package-lock.json
├─ package.json
├─ public
│  ├─ css
│  │  ├─ style.css
│  │  ├─ style.min.css
│  │  └─ style.min.css.map
│  ├─ fonts
│  │  ├─ demo.html
│  │  ├─ Inter-Black.woff2
│  │  ├─ Inter-Bold.woff2
│  │  ├─ Inter-ExtraBold.woff2
│  │  ├─ Inter-ExtraLight.woff2
│  │  ├─ Inter-Light.woff2
│  │  ├─ Inter-Medium.woff2
│  │  ├─ Inter-Regular.woff2
│  │  ├─ Inter-SemiBold.woff2
│  │  ├─ Inter-Thin.woff2
│  │  └─ stylesheet.css
│  ├─ img
│  │  ├─ avatar
│  │  │  ├─ avatar-2.svg
│  │  │  ├─ avatar-face-02.png
│  │  │  ├─ avatar-face-02.webp
│  │  │  ├─ avatar-face-03.png
│  │  │  ├─ avatar-face-03.webp
│  │  │  ├─ avatar-face-04.png
│  │  │  ├─ avatar-face-04.webp
│  │  │  ├─ avatar-face-05.png
│  │  │  ├─ avatar-face-05.webp
│  │  │  ├─ avatar-illustrated-01.png
│  │  │  ├─ avatar-illustrated-01.webp
│  │  │  ├─ avatar-illustrated-02.png
│  │  │  ├─ avatar-illustrated-02.webp
│  │  │  ├─ avatar-illustrated-03.png
│  │  │  ├─ avatar-illustrated-03.webp
│  │  │  ├─ avatar-illustrated-04.png
│  │  │  ├─ avatar-illustrated-04.webp
│  │  │  └─ Avatar.svg
│  │  ├─ categories
│  │  │  ├─ 01.jpg
│  │  │  ├─ 01.webp
│  │  │  ├─ 02.jpg
│  │  │  ├─ 02.webp
│  │  │  ├─ 03.jpg
│  │  │  ├─ 03.webp
│  │  │  ├─ 04.jpg
│  │  │  └─ 04.webp
│  │  └─ svg
│  │     ├─ 404.svg
│  │     ├─ baloon.svg
│  │     ├─ Bulk
│  │     │  ├─ 2 User.svg
│  │     │  ├─ 3-User-gray.svg
│  │     │  ├─ 3-User-white.svg
│  │     │  ├─ Activity.svg
│  │     │  ├─ AddUser.svg
│  │     │  ├─ Arrow-Down.svg
│  │     │  ├─ Arrow-Down2.svg
│  │     │  ├─ Arrow-Down3.svg
│  │     │  ├─ Arrow-DownCircle.svg
│  │     │  ├─ Arrow-DownSquare.svg
│  │     │  ├─ Arrow-Left.svg
│  │     │  ├─ Arrow-Left2.svg
│  │     │  ├─ Arrow-Left3.svg
│  │     │  ├─ Arrow-LeftCircle.svg
│  │     │  ├─ Arrow-LeftSquare.svg
│  │     │  ├─ Arrow-Right.svg
│  │     │  ├─ Arrow-Right2.svg
│  │     │  ├─ Arrow-Right3.svg
│  │     │  ├─ Arrow-RightCircle.svg
│  │     │  ├─ Arrow-RightSquare.svg
│  │     │  ├─ Arrow-Up.svg
│  │     │  ├─ Arrow-Up2.svg
│  │     │  ├─ Arrow-Up3.svg
│  │     │  ├─ Arrow-UpCircle.svg
│  │     │  ├─ Arrow-UpSquare.svg
│  │     │  ├─ Arrows-up-down.svg
│  │     │  ├─ Bag 3.svg
│  │     │  ├─ Bag.svg
│  │     │  ├─ Bookmark.svg
│  │     │  ├─ Buy.svg
│  │     │  ├─ Calendar.svg
│  │     │  ├─ Call Missed.svg
│  │     │  ├─ Call Silent.svg
│  │     │  ├─ Call.svg
│  │     │  ├─ Calling.svg
│  │     │  ├─ Camera.svg
│  │     │  ├─ Category-gray.svg
│  │     │  ├─ Category-white.svg
│  │     │  ├─ Chart.svg
│  │     │  ├─ Chat.svg
│  │     │  ├─ Close Square.svg
│  │     │  ├─ Danger.svg
│  │     │  ├─ Delete.svg
│  │     │  ├─ Discount.svg
│  │     │  ├─ Discovery.svg
│  │     │  ├─ Document-gray.svg
│  │     │  ├─ Document-white.svg
│  │     │  ├─ Download.svg
│  │     │  ├─ Edit Square.svg
│  │     │  ├─ Edit-gray.svg
│  │     │  ├─ Edit-white.svg
│  │     │  ├─ Filter 2.svg
│  │     │  ├─ Filter.svg
│  │     │  ├─ Folder-gray.svg
│  │     │  ├─ Folder-white.svg
│  │     │  ├─ Game.svg
│  │     │  ├─ Graph.svg
│  │     │  ├─ Heart.svg
│  │     │  ├─ Hide.svg
│  │     │  ├─ Home-gray.svg
│  │     │  ├─ Home-white.svg
│  │     │  ├─ Image 3.svg
│  │     │  ├─ Image-gray.svg
│  │     │  ├─ Image-white.svg
│  │     │  ├─ Info Circle.svg
│  │     │  ├─ Info Square.svg
│  │     │  ├─ Location.svg
│  │     │  ├─ Lock.svg
│  │     │  ├─ Login.svg
│  │     │  ├─ Logout.svg
│  │     │  ├─ Menu-toggle-gray.svg
│  │     │  ├─ Menu-toggle-white.svg
│  │     │  ├─ Message-gray.svg
│  │     │  ├─ Message-white.svg
│  │     │  ├─ More Circle.svg
│  │     │  ├─ More Square.svg
│  │     │  ├─ Notification-gray.svg
│  │     │  ├─ Notification.svg
│  │     │  ├─ Paper Download.svg
│  │     │  ├─ Paper Fail.svg
│  │     │  ├─ Paper Negative.svg
│  │     │  ├─ Paper Plus.svg
│  │     │  ├─ Paper Upload.svg
│  │     │  ├─ Paper-gray.svg
│  │     │  ├─ Paper-white.svg
│  │     │  ├─ Password.svg
│  │     │  ├─ Play.svg
│  │     │  ├─ Plus.svg
│  │     │  ├─ Profile.svg
│  │     │  ├─ Scan.svg
│  │     │  ├─ Search.svg
│  │     │  ├─ Send.svg
│  │     │  ├─ Setting-gray.svg
│  │     │  ├─ Setting-white.svg
│  │     │  ├─ Settings-line.svg
│  │     │  ├─ Shield Done.svg
│  │     │  ├─ Shield Fail.svg
│  │     │  ├─ Show.svg
│  │     │  ├─ Star.svg
│  │     │  ├─ Swap.svg
│  │     │  ├─ Tick Square.svg
│  │     │  ├─ Ticket Star.svg
│  │     │  ├─ Ticket.svg
│  │     │  ├─ Time Square.svg
│  │     │  ├─ TimeCircle.svg
│  │     │  ├─ Unlock.svg
│  │     │  ├─ Upload.svg
│  │     │  ├─ Video.svg
│  │     │  ├─ Voice 3.svg
│  │     │  ├─ Voice.svg
│  │     │  ├─ Volume Down.svg
│  │     │  ├─ Volume Off.svg
│  │     │  ├─ Volume Up.svg
│  │     │  ├─ Wallet.svg
│  │     │  └─ Work.svg
│  │     ├─ customers.svg
│  │     ├─ dropbox.svg
│  │     ├─ GoogleDrive.svg
│  │     ├─ image-frame.svg
│  │     ├─ Logo.svg
│  │     ├─ move.svg
│  │     ├─ radio.svg
│  │     └─ thumbnail.svg
│  ├─ js
│  │  ├─ inicio.js
│  │  ├─ script.js
│  │  └─ socketClient.js
│  └─ plugins
│     ├─ chart.min.js
│     ├─ feather.min.js
│     └─ feather.min.js.map
├─ README.md
├─ routes
│  ├─ page.js
│  ├─ sensor.js
│  └─ user.js
├─ sockets.js
├─ test.js
├─ utils
│  ├─ db.js
│  └─ notification.js
└─ views
   ├─ 404.ejs
   ├─ inicio.ejs
   ├─ layout.ejs
   └─ login.ejs

```