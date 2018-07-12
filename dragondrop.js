// import DragonDrop from 'drag-on-drop';
    const demo1 = document.getElementById('demo-1');
    const dragonDrop = new DragonDrop(demo1, {
      handle: '.handle',
      announcement: {
        grabbed: el => `${el.querySelector('span').innerText} grabbed`,
        dropped: el => `${el.querySelector('span').innerText} dropped`,
        reorder: (el, items) => {
          const pos = items.indexOf(el) + 1;
          const text = el.querySelector('span').innerText;
          return `The rankings have been updated, ${text} is now ranked #${pos} out of ${items.length}`;
        },
        cancel: 'Reranking cancelled.'
      }
    });

  dragonDrop
  .on('grabbed', (container, item) => console.log(`Item ${item.innerText} grabbed`))
  .on('dropped', (container, item) => console.log(`Item ${item.innerText} dropped`))
  .on('reorder', (container, item) => console.log(`Reorder: ${item.innerText} has moved`))
  .on('cancel', () => console.log('Reordering cancelled'));