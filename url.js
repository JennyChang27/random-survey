<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Random Survey Redirect</title>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
</head>
<body>
  <h2>請稍候...</h2>

  <script>
    // 1️⃣ Firebase 初始化，填入你的專案資訊
    const firebaseConfig = {
  apiKey: "AIzaSyDwNLmo8CbUy_yz8Phay5ugxBVnsTWxrtc",
  authDomain: "random-survey-abe86.firebaseapp.com",
  projectId: "random-survey-abe86",
  storageBucket: "random-survey-abe86.firebasestorage.app",
  messagingSenderId: "586364937583",
  appId: "1:586364937583:web:1b95dbb866c3305230f49a",
  measurementId: "G-SC7Q6VY1RS"
};
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const perGroupLimit = 50; // 每組人數上限

    async function assignGroup() {
      // 讀取 surveyGroups collection
      const snapshot = await db.collection('surveyGroups').get();
      const groups = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.count < perGroupLimit) {
          groups.push({id: doc.id, ...data});
        }
      });

      if (groups.length === 0) {
        document.body.innerHTML = "<h2>感謝參與，本研究已額滿！</h2>";
        return;
      }

      // 隨機分派一組
      const chosen = groups[Math.floor(Math.random() * groups.length)];

      // Firestore transaction 增加 count
      const groupRef = db.collection('surveyGroups').doc(chosen.id);
      await db.runTransaction(async (t) => {
        const doc = await t.get(groupRef);
        const currentCount = doc.data().count;
        if (currentCount >= perGroupLimit) {
          throw "Full"; // 若有人先搶滿，重新分派
        }
        t.update(groupRef, {count: currentCount + 1});
      });

      // 導向 SurveyCake
      window.location.href = chosen.url;
    }

    assignGroup().catch(err => {
      if (err === "Full") {
        window.location.reload(); // 若有人先占滿，重新分派
      } else {
        console.error(err);
        document.body.innerHTML = "<h2>發生錯誤，請稍後再試。</h2>";
      }
    });
  </script>
</body>
</html>
