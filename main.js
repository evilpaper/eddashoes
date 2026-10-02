(() => {
  const body = document.body;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  setTimeout(() => body.classList.remove("is-loading"), reduced ? 0 : 2300);

  document.querySelectorAll(".index__list li").forEach((li, i) => li.style.setProperty("--i", i));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  const footWord = document.querySelector(".foot__word");
  const fitFootWord = () => {
    footWord.style.fontSize = "100px";
    const pad = parseFloat(getComputedStyle(document.querySelector(".foot__meta")).paddingLeft);
    const target = document.documentElement.clientWidth - pad * 2;
    const width = footWord.firstElementChild.getBoundingClientRect().width;
    footWord.style.fontSize = `${(100 * target) / width}px`;
  };
  document.fonts.ready.then(fitFootWord);
  window.addEventListener("resize", fitFootWord);

  const bar = document.querySelector(".bar");
  const hero = document.querySelector(".hero");
  const foot = document.querySelector(".foot");
  const updateBar = () => {
    const edge = bar.offsetHeight / 2;
    const overPaper = hero.getBoundingClientRect().bottom < edge && foot.getBoundingClientRect().top > edge;
    bar.classList.toggle("is-dark", overPaper);
  };
  window.addEventListener("scroll", updateBar, { passive: true });
  updateBar();

  if (reduced) return;

  const heroMedia = document.querySelector(".hero__media");
  let ticking = false;

  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    const y = window.scrollY;

    if (y < vh * 1.2) heroMedia.style.transform = `translate3d(0, ${y * 0.4}px, 0)`;

    const f = foot.getBoundingClientRect();
    const footProgress = Math.min(Math.max((vh - f.top) / f.height, 0), 1);
    footWord.style.setProperty("--lift", `${(1 - footProgress) * 35}%`);
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
})();
