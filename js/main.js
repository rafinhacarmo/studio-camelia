// Studio Camélia — interações
(function () {
  'use strict';

  var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- navegação: sombra ao rolar + botão flutuante ---------- */
  var topo = document.querySelector('.topo');
  var flutuante = document.querySelector('.whats-flutuante');
  var hero = document.querySelector('.hero');

  function aoRolar() {
    topo.classList.toggle('rolou', window.scrollY > 8);
    if (flutuante && hero) {
      var passouHero = window.scrollY > hero.offsetTop + hero.offsetHeight * 0.6;
      flutuante.classList.toggle('visivel', passouHero);
    }
  }
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  /* ---------- menu mobile ---------- */
  var menuBtn = document.querySelector('.nav__menu-btn');
  var links = document.getElementById('nav-links');

  menuBtn.addEventListener('click', function () {
    var aberto = links.classList.toggle('aberto');
    menuBtn.setAttribute('aria-expanded', String(aberto));
    menuBtn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && links.classList.contains('aberto')) {
      links.classList.remove('aberto');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- revelar ao rolar (com escalonamento por grupo) ---------- */
  var reveais = document.querySelectorAll('.revelar');

  if ('IntersectionObserver' in window && !reduzMovimento) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var el = entrada.target;
        // escalona irmãos que aparecem juntos
        var irmaos = el.parentElement ? el.parentElement.querySelectorAll(':scope > .revelar') : [];
        var indice = Array.prototype.indexOf.call(irmaos, el);
        el.style.setProperty('--atraso', Math.max(0, indice) * 90 + 'ms');
        el.classList.add('visivel');
        observador.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveais.forEach(function (el) { observador.observe(el); });
  } else {
    reveais.forEach(function (el) { el.classList.add('visivel'); });
  }

  /* ---------- abas "Cartela de olhares" ---------- */
  var abas = Array.prototype.slice.call(document.querySelectorAll('.olhares__aba'));
  var paineis = Array.prototype.slice.call(document.querySelectorAll('.olhares__painel'));

  function ativarAba(aba, focar) {
    abas.forEach(function (a) {
      var ativa = a === aba;
      a.setAttribute('aria-selected', String(ativa));
      a.tabIndex = ativa ? 0 : -1;
    });
    paineis.forEach(function (p) {
      p.hidden = p.id !== aba.getAttribute('aria-controls');
    });
    if (focar) aba.focus();
  }

  abas.forEach(function (aba, i) {
    aba.addEventListener('click', function () { ativarAba(aba, false); });
    aba.addEventListener('keydown', function (e) {
      var destino = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') destino = abas[(i + 1) % abas.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') destino = abas[(i - 1 + abas.length) % abas.length];
      if (e.key === 'Home') destino = abas[0];
      if (e.key === 'End') destino = abas[abas.length - 1];
      if (destino) {
        e.preventDefault();
        ativarAba(destino, true);
      }
    });
  });
})();
