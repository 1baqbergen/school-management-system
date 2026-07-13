module.exports = (message, data) => {
  return `
Сен мектептің кәсіби AI аналитигісің.

Сұрақ:
${message}

======================
 ЖАЛПЫ СТАТИСТИКА:
${JSON.stringify(data.stats)}

 ҮЗДІК ОҚУШЫЛАР:
${JSON.stringify(data.topStudents)}

 ӘЛСІЗ ОҚУШЫЛАР:
${JSON.stringify(data.weakStudents)}

 ПӘН РЕЙТИНГІ:
${JSON.stringify(data.subjects)}
======================

Ереже:
- Қазақ тілінде жауап бер
- Аналитика жаса
- Нақты жауап бер

Формат:
 Нәтиже:
...

 Анализ:
...

 Қорытынды:
...
`;
};