/**
 * ГП «ПОЛЁТ» — общий скрипт сайта.
 * Состояние шапки, мобильное меню, появление блоков, счётчики, видео.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        /* ---- Шапка: заливка после первого экрана ---------------------- */
        var hdr = document.querySelector('.hdr');
        if (hdr && !hdr.classList.contains('is-solid')) {
            var onScroll = function () {
                hdr.classList.toggle('is-stuck', window.scrollY > 40);
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }

        /* ---- Мобильное меню ------------------------------------------- */
        var burger = document.querySelector('.burger');
        var mobile = document.querySelector('.mobile-nav');
        if (burger && mobile) {
            burger.addEventListener('click', function () {
                var open = mobile.classList.toggle('is-open');
                burger.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            mobile.querySelectorAll('a').forEach(function (a) {
                a.addEventListener('click', function () {
                    mobile.classList.remove('is-open');
                    burger.setAttribute('aria-expanded', 'false');
                });
            });
            document.addEventListener('keydown', function (e) {
                if (e.key !== 'Escape') return;
                mobile.classList.remove('is-open');
                burger.setAttribute('aria-expanded', 'false');
            });
        }

        /* ---- Появление блоков ----------------------------------------- */
        var items = document.querySelectorAll('.rv');
        if (items.length) {
            if (!('IntersectionObserver' in window)) {
                items.forEach(function (el) { el.classList.add('in'); });
            } else {
                var io = new IntersectionObserver(function (entries) {
                    entries.forEach(function (e) {
                        if (!e.isIntersecting) return;
                        e.target.classList.add('in');
                        io.unobserve(e.target);
                    });
                }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
                items.forEach(function (el) { io.observe(el); });
            }
        }

        /* ---- Счётчики -------------------------------------------------- */
        var nums = document.querySelectorAll('[data-count]');
        if (nums.length && 'IntersectionObserver' in window) {
            var numObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (!e.isIntersecting) return;
                    var el = e.target;
                    numObs.unobserve(el);
                    var target = parseInt(el.getAttribute('data-count'), 10);
                    var started = performance.now();
                    var tick = function (now) {
                        var p = Math.min((now - started) / 1500, 1);
                        var eased = 1 - Math.pow(1 - p, 3);
                        el.textContent = Math.floor(eased * target).toLocaleString('ru-RU');
                        if (p < 1) requestAnimationFrame(tick);
                        else el.textContent = target.toLocaleString('ru-RU');
                    };
                    requestAnimationFrame(tick);
                });
            }, { threshold: 0.6 });
            nums.forEach(function (n) { numObs.observe(n); });
        }

        /* ---- Видео ------------------------------------------------------
           Съёмки цеха пока нет, поэтому кнопка честно об этом сообщает.
           Когда появится файл — здесь подставляется локальный <video>. */
        var reel = document.getElementById('reel');
        var play = document.getElementById('reelPlay');
        if (reel && play) {
            play.addEventListener('click', function () {
                if (reel.querySelector('.reel-note')) return;
                var note = document.createElement('div');
                note.className = 'reel-note';
                note.textContent = 'Съёмка производства готовится — ролик появится здесь';
                reel.querySelector('.reel-frame').appendChild(note);
            });
        }

        /* ---- Форма: демонстрационная, ничего не отправляет ------------- */
        var form = document.getElementById('leadForm');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var note = form.querySelector('.form-note');
                if (note) {
                    note.textContent = 'Это демонстрационный макет — заявка не отправляется. ' +
                        'На рабочем сайте здесь будет отправка на info@npppolet.ru.';
                    note.style.color = 'var(--red)';
                }
            });
        }
    });
})();
