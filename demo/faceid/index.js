/*
  Human
  homepage: <https://github.com/vladmandic/human>
  author: <https://github.com/vladmandic>'
*/

import * as S from "../../dist/human.esm.js";
var l,
  L = "human",
  f = "person",
  v = (...a) => console.log("indexdb", ...a);
async function h() {
  return l
    ? !0
    : new Promise((a) => {
        let n = indexedDB.open(L, 1);
        (n.onerror = (o) => v("error:", o)),
          (n.onupgradeneeded = (o) => {
            v("create:", o.target),
              (l = o.target.result),
              l.createObjectStore(f, { keyPath: "id", autoIncrement: !0 });
          }),
          (n.onsuccess = (o) => {
            (l = o.target.result), v("open:", l), a(!0);
          });
      });
}
async function C() {
  let a = [];
  return (
    l || (await h()),
    new Promise((n) => {
      let o = l
        .transaction([f], "readwrite")
        .objectStore(f)
        .openCursor(null, "next");
      (o.onerror = (i) => v("load error:", i)),
        (o.onsuccess = (i) => {
          i.target.result
            ? (a.push(i.target.result.value), i.target.result.continue())
            : n(a);
        });
    })
  );
}
async function b() {
  return (
    l || (await h()),
    new Promise((a) => {
      let n = l.transaction([f], "readwrite").objectStore(f).count();
      (n.onerror = (o) => v("count error:", o)),
        (n.onsuccess = () => a(n.result));
    })
  );
}
async function x(a) {
  l || (await h());
  let n = { name: a.name, descriptor: a.descriptor, image: a.image };
  l.transaction([f], "readwrite").objectStore(f).put(n), v("save:", n);
}
async function D(a) {
  l || (await h()),
    l.transaction([f], "readwrite").objectStore(f).delete(a.id),
    v("delete:", a);
}
var g = {
    cacheSensitivity: 0.01,
    modelBasePath: "../../models",
    filter: { enabled: !0, equalization: !0 },
    debug: !0,
    face: {
      enabled: !0,
      detector: { rotation: !0, return: !0, mask: !1 },
      description: { enabled: !0 },
      iris: { enabled: !0 },
      emotion: { enabled: !1 },
      antispoof: { enabled: !0 },
      liveness: { enabled: !0 },
    },
    body: { enabled: !1 },
    hand: { enabled: !1 },
    object: { enabled: !1 },
    gesture: { enabled: !0 },
  },
  B = { order: 2, multiplier: 25, min: 0.2, max: 0.8 },
  r = {
    minConfidence: 0.6,
    minSize: 224,
    maxTime: 3e4,
    blinkMin: 10,
    blinkMax: 800,
    threshold: 0.5,
    distanceMin: 0.4,
    distanceMax: 1,
    mask: g.face.detector.mask,
    rotation: g.face.detector.rotation,
    ...B,
  },
  e = {
    faceCount: { status: !1, val: 0 },
    faceConfidence: { status: !1, val: 0 },
    facingCenter: { status: !1, val: 0 },
    lookingCenter: { status: !1, val: 0 },
    blinkDetected: { status: !1, val: 0 },
    faceSize: { status: !1, val: 0 },
    antispoofCheck: { status: !1, val: 0 },
    livenessCheck: { status: !1, val: 0 },
    distance: { status: !1, val: 0 },
    age: { status: !1, val: 0 },
    gender: { status: !1, val: 0 },
    timeout: { status: !0, val: 0 },
    descriptor: { status: !1, val: 0 },
    elapsedMs: { status: void 0, val: 0 },
    detectFPS: { status: void 0, val: 0 },
    drawFPS: { status: void 0, val: 0 },
  },
  E = () =>
    e.faceCount.status &&
    e.faceSize.status &&
    e.blinkDetected.status &&
    e.facingCenter.status &&
    e.lookingCenter.status &&
    e.faceConfidence.status &&
    e.antispoofCheck.status &&
    e.livenessCheck.status &&
    e.distance.status &&
    e.descriptor.status &&
    e.age.status &&
    e.gender.status,
  c = { face: null, record: null },
  u = { start: 0, end: 0, time: 0 },
  s = new S.Human(g);
s.env.perfadd = !1;
s.draw.options.font = 'small-caps 18px "Lato"';
s.draw.options.lineHeight = 20;
var t = {
    video: document.getElementById("video"),
    canvas: document.getElementById("canvas"),
    log: document.getElementById("log"),
    fps: document.getElementById("fps"),
    match: document.getElementById("match"),
    name: document.getElementById("name"),
    save: document.getElementById("save"),
    delete: document.getElementById("delete"),
    retry: document.getElementById("retry"),
    source: document.getElementById("source"),
    ok: document.getElementById("ok"),
  },
  y = { detect: 0, draw: 0 },
  I = 0,
  d = (...a) => {
    (t.log.innerText +=
      a.join(" ") +
      `
`),
      console.log(...a);
  };
async function H() {
  let a = {
      audio: !1,
      video: {
        facingMode: "user",
        resizeMode: "none",
        width: { ideal: document.body.clientWidth },
      },
    },
    n = await navigator.mediaDevices.getUserMedia(a),
    o = new Promise((i) => {
      t.video.onloadeddata = () => i(!0);
    });
  (t.video.srcObject = n),
    t.video.play(),
    await o,
    (t.canvas.width = t.video.videoWidth),
    (t.canvas.height = t.video.videoHeight),
    (t.canvas.style.width = "50%"),
    (t.canvas.style.height = "50%"),
    s.env.initial &&
      d(
        "video:",
        t.video.videoWidth,
        t.video.videoHeight,
        "|",
        n.getVideoTracks()[0].label
      ),
    (t.canvas.onclick = () => {
      t.video.paused ? t.video.play() : t.video.pause();
    });
}
async function T() {
  var a;
  if (!t.video.paused) {
    (a = c.face) != null && a.tensor && s.tf.dispose(c.face.tensor),
      await s.detect(t.video);
    let n = s.now();
    (e.detectFPS.val = Math.round(1e4 / (n - y.detect)) / 10),
      (y.detect = n),
      requestAnimationFrame(T);
  }
}
function P() {
  let a = 32;
  for (let [n, o] of Object.entries(e)) {
    let i = document.getElementById(`ok-${n}`);
    i ||
      ((i = document.createElement("div")),
      (i.id = `ok-${n}`),
      (i.innerText = n),
      (i.className = "ok"),
      (i.style.top = `${a}px`),
      t.ok.appendChild(i)),
      typeof o.status == "boolean" &&
        (i.style.backgroundColor = o.status ? "lightgreen" : "lightcoral");
    let m = o.status ? "ok" : "fail";
    (i.innerText = `${n}: ${o.val === 0 ? m : o.val}`), (a += 28);
  }
}
async function R() {
  var o;
  let a = s.next(s.result);
  s.draw.canvas(t.video, t.canvas), await s.draw.all(t.canvas, a);
  let n = s.now();
  if (
    ((e.drawFPS.val = Math.round(1e4 / (n - y.draw)) / 10),
    (y.draw = n),
    (e.faceCount.val = s.result.face.length),
    (e.faceCount.status = e.faceCount.val === 1),
    e.faceCount.status)
  ) {
    let i = Object.values(s.result.gesture).map((m) => m.gesture);
    (i.includes("blink left eye") || i.includes("blink right eye")) &&
      (u.start = s.now()),
      u.start > 0 &&
        !i.includes("blink left eye") &&
        !i.includes("blink right eye") &&
        (u.end = s.now()),
      (e.blinkDetected.status =
        e.blinkDetected.status ||
        (Math.abs(u.end - u.start) > r.blinkMin &&
          Math.abs(u.end - u.start) < r.blinkMax)),
      e.blinkDetected.status &&
        u.time === 0 &&
        (u.time = Math.trunc(u.end - u.start)),
      (e.facingCenter.status = i.includes("facing center")),
      (e.lookingCenter.status = i.includes("looking center")),
      (e.faceConfidence.val =
        s.result.face[0].faceScore || s.result.face[0].boxScore || 0),
      (e.faceConfidence.status = e.faceConfidence.val >= r.minConfidence),
      (e.antispoofCheck.val = s.result.face[0].real || 0),
      (e.antispoofCheck.status = e.antispoofCheck.val >= r.minConfidence),
      (e.livenessCheck.val = s.result.face[0].live || 0),
      (e.livenessCheck.status = e.livenessCheck.val >= r.minConfidence),
      (e.faceSize.val = Math.min(
        s.result.face[0].box[2],
        s.result.face[0].box[3]
      )),
      (e.faceSize.status = e.faceSize.val >= r.minSize),
      (e.distance.val = s.result.face[0].distance || 0),
      (e.distance.status =
        e.distance.val >= r.distanceMin && e.distance.val <= r.distanceMax),
      (e.descriptor.val =
        ((o = s.result.face[0].embedding) == null ? void 0 : o.length) || 0),
      (e.descriptor.status = e.descriptor.val > 0),
      (e.age.val = s.result.face[0].age || 0),
      (e.age.status = e.age.val > 0),
      (e.gender.val = s.result.face[0].genderScore || 0),
      (e.gender.status = e.gender.val >= r.minConfidence);
  }
  return (
    (e.timeout.status = e.elapsedMs.val <= r.maxTime),
    P(),
    E() || !e.timeout.status
      ? (t.video.pause(), s.result.face[0])
      : ((e.elapsedMs.val = Math.trunc(s.now() - I)),
        new Promise((i) => {
          setTimeout(async () => {
            await R(), i(s.result.face[0]);
          }, 30);
        }))
  );
}
async function F() {
  var a, n, o, i;
  if (t.name.value.length > 0) {
    let m =
        (a = t.canvas.getContext("2d")) == null
          ? void 0
          : a.getImageData(0, 0, t.canvas.width, t.canvas.height),
      p = {
        id: 0,
        name: t.name.value,
        descriptor: (n = c.face) == null ? void 0 : n.embedding,
        image: m,
      };
    await x(p),
      d(
        "saved face record:",
        p.name,
        "descriptor length:",
        (i = (o = c.face) == null ? void 0 : o.embedding) == null
          ? void 0
          : i.length
      ),
      d("known face records:", await b());
  } else d("invalid name");
}
async function j() {
  c.record && c.record.id > 0 && (await D(c.record));
}
async function $() {
  var i, m, p, k;
  if (
    ((t.canvas.style.height = ""),
    (i = t.canvas.getContext("2d")) == null ||
      i.clearRect(0, 0, r.minSize, r.minSize),
    !((m = c == null ? void 0 : c.face) != null && m.tensor) ||
      !((p = c == null ? void 0 : c.face) != null && p.embedding))
  )
    return !1;
  if (
    (console.log("face record:", c.face),
    d(
      `detected face: ${c.face.gender} ${c.face.age || 0}y distance ${
        100 * (c.face.distance || 0)
      }cm/${Math.round((100 * (c.face.distance || 0)) / 2.54)}in`
    ),
    await s.draw.tensor(c.face.tensor, t.canvas),
    (await b()) === 0)
  )
    return (
      d("face database is empty: nothing to compare face with"),
      (document.body.style.background = "black"),
      (t.delete.style.display = "none"),
      !1
    );
  let a = await C(),
    n = a.map((w) => w.descriptor).filter((w) => w.length > 0),
    o = s.match.find(c.face.embedding, n, B);
  return (
    (c.record = a[o.index] || null),
    c.record &&
      (d(
        `best match: ${c.record.name} | id: ${c.record.id} | similarity: ${
          Math.round(1e3 * o.similarity) / 10
        }%`
      ),
      (t.name.value = c.record.name),
      (t.source.style.display = ""),
      (k = t.source.getContext("2d")) == null ||
        k.putImageData(c.record.image, 0, 0)),
    (document.body.style.background =
      o.similarity > r.threshold ? "darkgreen" : "maroon"),
    o.similarity > r.threshold
  );
}
async function M() {
  var a, n, o, i;
  return (
    (e.faceCount.status = !1),
    (e.faceConfidence.status = !1),
    (e.facingCenter.status = !1),
    (e.blinkDetected.status = !1),
    (e.faceSize.status = !1),
    (e.antispoofCheck.status = !1),
    (e.livenessCheck.status = !1),
    (e.age.status = !1),
    (e.gender.status = !1),
    (e.elapsedMs.val = 0),
    (t.match.style.display = "none"),
    (t.retry.style.display = "none"),
    (t.source.style.display = "none"),
    (t.canvas.style.height = "50%"),
    (document.body.style.background = "black"),
    await H(),
    await T(),
    (I = s.now()),
    (c.face = await R()),
    (t.canvas.width =
      ((n = (a = c.face) == null ? void 0 : a.tensor) == null
        ? void 0
        : n.shape[1]) || r.minSize),
    (t.canvas.height =
      ((i = (o = c.face) == null ? void 0 : o.tensor) == null
        ? void 0
        : i.shape[0]) || r.minSize),
    (t.source.width = t.canvas.width),
    (t.source.height = t.canvas.height),
    (t.canvas.style.width = ""),
    (t.match.style.display = "flex"),
    (t.save.style.display = "flex"),
    (t.delete.style.display = "flex"),
    (t.retry.style.display = "block"),
    E() ? $() : (d("did not find valid face"), !1)
  );
}
async function q() {
  var a, n;
  d("| tfjs version:", s.tf.version["tfjs-core"]),
    d(
      "options:",
      JSON.stringify(r)
        .replace(/{|}|"|\[|\]/g, "")
        .replace(/,/g, " ")
    ),
    d("initializing webcam..."),
    await H(),
    d("loading human models..."),
    await s.load(),
    d("initializing human..."),
    d(
      "face embedding model:",
      g.face.description.enabled ? "faceres" : "",
      (a = g.face.mobilefacenet) != null && a.enabled ? "mobilefacenet" : "",
      (n = g.face.insightface) != null && n.enabled ? "insightface" : ""
    ),
    d("loading face database..."),
    d("known face records:", await b()),
    t.retry.addEventListener("click", M),
    t.save.addEventListener("click", F),
    t.delete.addEventListener("click", j),
    await s.warmup(),
    await M();
}
window.onload = q;
//# sourceMappingURL=index.js.map
