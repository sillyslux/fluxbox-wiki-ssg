/* global fetch, window, document, JsDiff */
/* eslint-disable no-console */
fetch('//fluxbox-wiki.dev.lncr/pages/WikiPages/Fluxbox/en.md').then(res => res.text()).then((data) => {
  const a = data
  const b = data
  const diff = JsDiff.diffChars(a, b)
  const display = document.getElementById('display')
  const hidden = document.getElementById('hidden')
  display.textContent = data
  hidden.textContent = data
  const fragment = document.createDocumentFragment()
  let color
  let span = null
  const result = document.querySelector('#result')

  diff.forEach(function (part) {
  // green for additions, red for deletions
  // grey for common parts
    color = part.added ? 'green' :
      part.removed ? 'red' : 'grey'
    span = document.createElement('span')
    span.style.color = color
    span.appendChild(document
      .createTextNode(part.value))
    fragment.appendChild(span)
  })

  result.appendChild(fragment)
  display.contentEditable = 'true'
  // window.addEventListener('keydown', (evt)=>console.log(evt))
  function changed() {
  	const diff = JsDiff.diffLines(b, document.querySelector('#display').textContent)
  	var fragment = document.createDocumentFragment()
  	for (var i=0; i < diff.length; i++) {

  		if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
  			var swap = diff[i]
		    diff[i] = diff[i + 1]
  			diff[i + 1] = swap
  		}

  		var node;
  		if (diff[i].removed) {
  			node = document.createElement('del');
  			node.appendChild(document.createTextNode(diff[i].value));
  		} else if (diff[i].added) {
  			node = document.createElement('ins');
  			node.appendChild(document.createTextNode(diff[i].value));
  		} else {
  			node = document.createTextNode(diff[i].value);
  		}
  		fragment.appendChild(node);
  	}

  	result.textContent = '';
  	result.appendChild(fragment);
  }
  display.onpaste = display.onchange = changed;
  if ('oninput' in display) {
    display.oninput = changed;
  } else {
    display.onkeyup = changed;
  }
})
