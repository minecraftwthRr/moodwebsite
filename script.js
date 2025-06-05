document.addEventListener("DOMContentLoaded", () => {
  const moodSelect = document.getElementById("mood-select");
  const title = document.getElementById("mood-title");
  const message = document.getElementById("mood-message");
  const audioPlayer = document.getElementById("audio-player");
  const playBtn = document.getElementById("play");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");
  const progress = document.getElementById("progress");
  const volume = document.getElementById("volume");
  const timeDisplay = document.getElementById("time-display");
  const moodCanvas = document.getElementById("mood-canvas");
  const ctx = moodCanvas.getContext("2d");

  const moods = {
    happy: {
      title: "HAPPY",
      message: "Yay I'm happy!",
      songs: ["hap1.mp3", "hap2.mp3", "hap3.mp3", "hap4.mp3", "hap5.mp3"]
    },
    sad: {
      title: "SAD",
      message: "It's ok king.",
      songs: ["sad1.mp3", "sad2.mp3", "sad3.mp3", "sad4.mp3", "sad5.mp3"]
    },
    chill: {
      title: "CHILL",
      message: "Just relax and take it easy.",
      songs: ["chill1.mp3", "chill2.mp3", "chill3.mp3", "chill4.mp3", "chill5.mp3"]
    },
    angry: {
      title: "ANGRY",
      message: "Let it out.",
      songs: ["ang1.mp3", "ang2.mp3", "ang3.mp3", "ang4.mp3", "ang5.mp3"]
    },
    nostalgic: {
      title: "NOSTALGIC",
      message: "Remember?",
      songs: ["nos1.mp3", "nos2.mp3", "nos3.mp3", "nos4.mp3", "nos5.mp3"]
    }
  };

  let currentMood = null;
  let currentIndex = 0;
  let raindrops = [], ripples = [];
  let clouds = [], cloudOffset = 0;
  let leaves = [], sparkles = [];

  function resizeCanvas() {
    moodCanvas.width = window.innerWidth;
    moodCanvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);

  moodSelect.addEventListener("change", (e) => {
    const mood = e.target.value;
    currentMood = moods[mood];
    currentIndex = 0;

    title.textContent = currentMood.title;
    message.textContent = currentMood.message;
    loadSong();

    document.body.className = "";
    document.body.classList.add(`${mood}-theme`);

    stopAllEffects();
    if (mood === "sad") startRain();
    if (mood === "chill") startChillEffect();
    if (mood === "angry") startShake();
    if (mood === "nostalgic") startLeaves();
    if (mood === "happy") startSparkles();
  });

  function loadSong() {
    const song = currentMood.songs[currentIndex];
    audioPlayer.src = song;
    audioPlayer.play().catch(err => console.log(err));
    playBtn.textContent = "❚❚";
  }

  playBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playBtn.textContent = "❚❚";
    } else {
      audioPlayer.pause();
      playBtn.textContent = "▶️";
    }
  });

  nextBtn.addEventListener("click", () => {
    if (!currentMood) return;
    currentIndex = (currentIndex + 1) % currentMood.songs.length;
    loadSong();
  });

  prevBtn.addEventListener("click", () => {
    if (!currentMood) return;
    currentIndex = (currentIndex - 1 + currentMood.songs.length) % currentMood.songs.length;
    loadSong();
  });

  volume.addEventListener("input", () => {
    audioPlayer.volume = volume.value / 100;
  });

  audioPlayer.addEventListener("timeupdate", () => {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.value = percent || 0;
    timeDisplay.textContent = formatTime(audioPlayer.currentTime) + " / " + formatTime(audioPlayer.duration);
  });

  progress.addEventListener("input", () => {
    const time = (progress.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = time;
  });

  function formatTime(time) {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }

  // === EFFECTS ===
  function stopAllEffects() {
    raindrops = [];
    ripples = [];
    clouds = [];
    leaves = [];
    sparkles = [];
    ctx.clearRect(0, 0, moodCanvas.width, moodCanvas.height);
    document.body.classList.remove("shake");
  }

  // SAD - Rain + Ripples
  function startRain() {
    resizeCanvas();
    raindrops = Array.from({ length: 100 }, () => ({
      x: Math.random() * moodCanvas.width,
      y: Math.random() * moodCanvas.height,
      speed: Math.random() * 4 + 2,
      length: Math.random() * 20 + 10
    }));
    animateRain();
  }

  function animateRain() {
    if (!document.body.classList.contains("sad-theme")) return;
    ctx.clearRect(0, 0, moodCanvas.width, moodCanvas.height);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;

    for (let drop of raindrops) {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
      ctx.stroke();

      if (drop.y + drop.length >= moodCanvas.height - 5) {
        ripples.push({ x: drop.x, y: moodCanvas.height - 2, radius: 0 });
      }

      drop.y += drop.speed;
      if (drop.y > moodCanvas.height) {
        drop.y = -drop.length;
        drop.x = Math.random() * moodCanvas.width;
      }
    }

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ripples.forEach((ripple, i) => {
      ripple.radius += 0.5;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.stroke();
      if (ripple.radius > 20) ripples.splice(i, 1);
    });

    requestAnimationFrame(animateRain);
  }

  // CHILL - Clouds and Waves
  function startChillEffect() {
    resizeCanvas();
    cloudOffset = 0;
    clouds = Array.from({ length: 4 }, (_, i) => createCloud(i * 300, 100));
    animateWavesAndClouds();
  }

  function createCloud(x, y) {
    const circles = [];
    for (let i = 0; i < 7; i++) {
      circles.push({
        offsetX: Math.random() * 80 - 40,
        offsetY: Math.random() * 40 - 20,
        radius: Math.random() * 30 + 30
      });
    }
    return { x, y, circles };
  }

  function drawCloud(ctx, baseX, baseY, cloud) {
    for (let c of cloud.circles) {
      ctx.beginPath();
      ctx.arc(baseX + c.offsetX, baseY + c.offsetY, c.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fill();
    }
  }

  function animateWavesAndClouds() {
    if (!document.body.classList.contains("chill-theme")) return;
    ctx.clearRect(0, 0, moodCanvas.width, moodCanvas.height);

    const now = Date.now() / 1000;
    ctx.beginPath();
    ctx.moveTo(0, moodCanvas.height);
    for (let x = 0; x < moodCanvas.width; x++) {
      const y = 10 * Math.sin((x + now * 100) * 0.01) + moodCanvas.height - 60;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(moodCanvas.width, moodCanvas.height);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fill();

    cloudOffset += 0.2;
    for (let i = 0; i < clouds.length; i++) {
      const cloudX = (clouds[i].x + cloudOffset) % (moodCanvas.width + 300);
      drawCloud(ctx, cloudX, clouds[i].y, clouds[i]);
    }

    requestAnimationFrame(animateWavesAndClouds);
  }

  // ANGRY - Screen Shake
  function startShake() {
    const interval = setInterval(() => {
      if (!document.body.classList.contains("angry-theme")) {
        clearInterval(interval);
        document.body.classList.remove("shake");
        return;
      }

      if (Math.random() > 0.8 && !audioPlayer.paused && audioPlayer.volume > 0.5) {
        document.body.classList.add("shake");
        setTimeout(() => document.body.classList.remove("shake"), 100);
      }
    }, 500);
  }

  // NOSTALGIC - Falling Leaves
  function startLeaves() {
    resizeCanvas();
    leaves = Array.from({ length: 25 }, () => ({
      x: Math.random() * moodCanvas.width,
      y: Math.random() * moodCanvas.height,
      size: Math.random() * 10 + 5,
      speed: Math.random() * 1 + 0.5,
      sway: Math.random() * 2 + 1,
      phase: Math.random() * Math.PI * 2,
      shape: Math.random() > 0.5 ? "circle" : "triangle"
    }));
    animateLeaves();
  }

  function animateLeaves() {
    if (!document.body.classList.contains("nostalgic-theme")) return;
    ctx.clearRect(0, 0, moodCanvas.width, moodCanvas.height);

    for (let leaf of leaves) {
      leaf.y += leaf.speed;
      leaf.x += Math.sin(leaf.phase += 0.02) * leaf.sway;

      ctx.beginPath();
      if (leaf.shape === "circle") {
        ctx.arc(leaf.x, leaf.y, leaf.size, 0, Math.PI * 2);
      } else {
        ctx.moveTo(leaf.x, leaf.y);
        ctx.lineTo(leaf.x - leaf.size, leaf.y + leaf.size * 1.5);
        ctx.lineTo(leaf.x + leaf.size, leaf.y + leaf.size * 1.5);
        ctx.closePath();
      }
      ctx.fillStyle = "rgba(165, 42, 42, 0.6)";
      ctx.fill();

      if (leaf.y > moodCanvas.height) {
        leaf.y = -20;
        leaf.x = Math.random() * moodCanvas.width;
      }
    }

    requestAnimationFrame(animateLeaves);
  }

  // HAPPY - Sparkles
  function startSparkles() {
    resizeCanvas();
    sparkles = Array.from({ length: 40 }, () => ({
      x: Math.random() * moodCanvas.width,
      y: Math.random() * moodCanvas.height,
      size: Math.random() * 2 + 1,
      opacity: Math.random(),
      direction: Math.random() > 0.5 ? 1 : -1
    }));
    animateSparkles();
  }

  function animateSparkles() {
    if (!document.body.classList.contains("happy-theme")) return;
    ctx.clearRect(0, 0, moodCanvas.width, moodCanvas.height);

    for (let spark of sparkles) {
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${spark.opacity})`;
      ctx.fill();
      spark.opacity += spark.direction * 0.02;
      if (spark.opacity <= 0 || spark.opacity >= 1) spark.direction *= -1;
    }

    requestAnimationFrame(animateSparkles);
  }
});
