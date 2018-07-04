// TO DO LIST:
// 1-Figure out how to combine files (grunt) and load into Canvas
// 2) Check that next btn is working
// 3) Make a list of each module that still needs edits + what those edits are






  // Because of a race condition with Canvas, check for the next button about 5 times to hide it.
  function hideNext(checkCurr) {
    // console.log('Checked for the next button ' + checkCurr + ' times.');
    // $nextButton = $('.module-sequence-footer-button--next');
    // $nextButton.hide();

    // if ($nextButton.length < 1 && checkCurr < checksMax) {
    //   setTimeout(function () {
    //     hideNext(checkCurr + 1);
    //   }, 100);
    // }

    console.log("hideNext was called")
  }

  function allowNext() {
    // alert('Success!')
    // $nextButton.show();
    console.log("allowNext was called")
  }


  //NIGHT OUT SCRIPT

  if ($('#Sel').length) {
    console.log("Sel exists");
    var colors = [
      'blue',
      'blue-light',
      'green',
      'rose',
      'teal-dark',
      'white-blue',
      'tan',
      'pumpkin-dark'
    ];
    // Hide the next button
    hideNext(0);
    var nightOutItemsMin = 3;
    console.log("minimum selection set at " + nightOutItemsMin);
    // Make the elements draggable
    var drake = dragula([document.querySelector('.alc-learn--night-out__word-cloud'), document.querySelector('.alc-learn--night-out__response')]);

    // On every drop, if bag has enough element, show next button.
    //I think this needs to be a different indicator, like on every release of a mouse, check? Or something
    //not related to dragula since that's not what I'm using... 
    drake.on('drop', function(el, target, source, sibling) {
      if ($('#Sel').children().length >= nightOutItemsMin) {
        // Specific for Night Out #2
        if ($('#alc-learn--night-out__slide-two').length > 0) {
          $('.alc-learn--night-out__word-cloud').fadeOut(function() {
            $('.alc-learn--night-out__success').fadeIn()
          });
        }
        // General
        allowNext();
      }
    });

    // Shift position slightly and change color of each item
    $('.draggable').each(function(one, two) {
      var xChange = Math.random() * 12;
      var yChange = -(Math.random() * 12);

      $(this).css({
        '-webkit-transform': 'translate(' + xChange + 'px, ' + yChange + 'px)',
        'transform': 'translate(' + xChange + 'px, ' + yChange + 'px)',
      }).addClass('yoac-' + colors[Math.floor(Math.random()*colors.length)]);
    })
  }



//OUTSIDE A FUNCTION - why isn't this being called?


function check() {
if ($('#Sel').children().length >= 3) {
   	console.log("made it to ifdraggablechildren");
    // Specific for Night Out #2
    if ($('#alc-learn--night-out__slide-two').length > 0) {
          $('.alc-learn--night-out__word-cloud').fadeOut(function() {
            $('.alc-learn--night-out__success').fadeIn()
          });
        }
        // General
        allowNext();
    }
 };


// Function to get elements by class name for DOM fragment and tag name
function getElementsByClassName(objElement, strTagName, strClassName)
{
	var objCollection = objElement.getElementsByTagName(strTagName);
	var arReturn = [];
	var strClass, arClass, iClass, iCounter;
	// console.log( "getElementsByClassName, objElement is" objElement " and strTagName is" strTagName " and srtClassName is " srtClassName);

	for(iCounter=0; iCounter<objCollection.length; iCounter++)
	{
		strClass = objCollection[iCounter].className;
		if (strClass)
		{
			arClass = strClass.split(' ');
			for (iClass=0; iClass<arClass.length; iClass++)
			{
				if (arClass[iClass] == strClassName)
				{
					arReturn.push(objCollection[iCounter]);
					break;
				}
			}
		}
	}

	objCollection = null;
	return (arReturn);
}

var drag = {
	objCurrent : null,

	arTargets : ['Unsel', 'Sel'],

	initialise : function(objNode)
	{
		// Add event handlers
		objNode.onmousedown = drag.start;
		objNode.onclick = function() {this.focus();};
		objNode.onkeydown = drag.keyboardDragDrop;
		document.body.onclick = drag.removePopup;
		console.log("initialize");
		check();
	},

	keyboardDragDrop : function(objEvent)
	{
		objEvent = objEvent || window.event;
		drag.objCurrent = this;
		var arChoices = ['Unselect activity', 'Select activity'];
		var iKey = objEvent.keyCode;
		var objItem = drag.objCurrent;

			var strExisting = objItem.parentNode.getAttribute('id');
			var objMenu, objChoice, iCounter;
			console.log("keyboardDragDrop");

			if (iKey == 32)
			{
				document.onkeydown = function(){return objEvent.keyCode==38 || objEvent.keyCode==40 ? false : true;};
				// Set ARIA properties
				drag.objCurrent.setAttribute('aria-grabbed', 'true');
				drag.objCurrent.setAttribute('aria-owns', 'popup');
				// Build context menu
				objMenu = document.createElement('ul');
				objMenu.setAttribute('id', 'popup');
				objMenu.setAttribute('role', 'menu');
				for (iCounter=0; iCounter<arChoices.length; iCounter++)
				{
					if (drag.arTargets[iCounter] != strExisting)
					{
						objChoice = document.createElement('div');
						objChoice.appendChild(document.createTextNode(arChoices[iCounter]));
						objChoice.tabIndex = -1;
						objChoice.setAttribute('role', 'menuitem');
						objChoice.onmousedown = function() {drag.dropObject(this.firstChild.data.substr(0, 3));};
						objChoice.onkeydown = drag.handleContext;
						objChoice.onmouseover = function() {if (this.className.indexOf('hover') < 0) {this.className += ' hover';} };
						objChoice.onmouseout = function() {this.className = this.className.replace(/\s*hover/, ''); };
						objMenu.appendChild(objChoice);
					}
				}
				objItem.appendChild(objMenu);
				objMenu.firstChild.focus();
				objMenu.firstChild.className = 'focus';
				drag.identifyTargets(true);
			}
	},

	removePopup : function()
	{
		document.onkeydown = null;
		//this prints how many divs are inside #Sel, which will help me call allowNext when appropriate
		var ct = $('#Sel').children().length;
		console.log(ct);
		var objContext = document.getElementById('popup');
		console.log("removePopup")

		if (objContext)
		{
			objContext.parentNode.removeChild(objContext);
		}
	},

	handleContext : function(objEvent)
	{
		objEvent = objEvent || window.event;
		var objItem = objEvent.target || objEvent.srcElement;
		var iKey = objEvent.keyCode;
		var objFocus, objList, strTarget, iCounter;

		// Cancel default behaviour
		if (objEvent.stopPropagation)
		{
			objEvent.stopPropagation();
		}
		else if (objEvent.cancelBubble)
		{
			objEvent.cancelBubble = true;
		}
		if (objEvent.preventDefault)
		{
			objEvent.preventDefault();
		}
		else if (objEvent.returnValue)
		{
			objEvent.returnValue = false;
		}

		switch (iKey)
		{
			case 38 : // Down arrow
				objFocus = objItem.nextSibling;
				if (!objFocus)
				{
					objFocus = objItem.previousSibling;
				}
				objItem.className = '';
				objFocus.focus();
				objFocus.className = 'focus';
				break;
			case 40 : // Up arrow
				objFocus = objItem.previousSibling;
				if (!objFocus)
				{
					objFocus = objItem.nextSibling;
				}
				objItem.className = '';
				objFocus.focus();
				objFocus.className = 'focus';
				break;
			case 13 : // Enter
				strTarget = objItem.firstChild.data.substr(0, 3);
				drag.dropObject(strTarget);
				break;
			case 27 : // Escape
			case 9  : // Tab
				drag.objCurrent.removeAttribute('aria-owns');
				drag.objCurrent.removeChild(objItem.parentNode);
				drag.objCurrent.focus();
				for (iCounter=0; iCounter<drag.arTargets.length; iCounter++)
				{
					objList = document.getElementById(drag.arTargets[iCounter]);
					drag.objCurrent.setAttribute('aria-grabbed', 'false');
					objList.removeAttribute('aria-dropeffect');
					objList.className = '';
				}
				break;
		}
	},

	start : function(objEvent)
	{
		objEvent = objEvent || window.event;
		drag.removePopup();
		// Initialise properties
		drag.objCurrent = this;

		drag.objCurrent.lastX = objEvent.clientX;
		drag.objCurrent.lastY = objEvent.clientY;
		drag.objCurrent.style.zIndex = '2';
		drag.objCurrent.setAttribute('aria-grabbed', 'true');

		document.onmousemove = drag.drag;
		document.onmouseup = drag.end;
		drag.identifyTargets(true);

		return false;
	},

	drag : function(objEvent)
	{
		objEvent = objEvent || window.event;

		// Calculate new position
		var iCurrentY = objEvent.clientY;
		var iCurrentX = objEvent.clientX;
		var iYPos = parseInt(drag.objCurrent.style.top, 10);
		var iXPos = parseInt(drag.objCurrent.style.left, 10);
		var iNewX, iNewY;

		iNewX = iXPos + iCurrentX - drag.objCurrent.lastX;
		iNewY = iYPos + iCurrentY - drag.objCurrent.lastY;

		drag.objCurrent.style.left = iNewX + 'px';
		drag.objCurrent.style.top = iNewY + 'px';
		drag.objCurrent.lastX = iCurrentX;
		drag.objCurrent.lastY = iCurrentY;

		return false;
	},

	calculatePosition : function (objElement, strOffset)
	{
		var iOffset = 0;

		// Get offset position in relation to parent nodes
		if (objElement.offsetParent)
		{
			do 
			{
				iOffset += objElement[strOffset];
				objElement = objElement.offsetParent;
			} while (objElement);
		}

		return iOffset;
	},

	identifyTargets : function (bHighlight)
	{
		var strExisting = drag.objCurrent.parentNode.getAttribute('id');
		var objList, iCounter;

		// Highlight the targets for the current drag item
		for (iCounter=0; iCounter<drag.arTargets.length; iCounter++)
		{
			objList = document.getElementById(drag.arTargets[iCounter]);
			if (bHighlight && drag.arTargets[iCounter] != strExisting)
			{
				objList.className = 'highlight';
				objList.setAttribute('aria-dropeffect', 'move');
			}
			else
			{
				objList.className = '';
				objList.removeAttribute('aria-dropeffect');
			}
		}
	},

	getTarget : function()
	{
		var strExisting = drag.objCurrent.parentNode.getAttribute('id');
		var iCurrentLeft = drag.calculatePosition(drag.objCurrent, 'offsetLeft');
		var iCurrentTop = drag.calculatePosition(drag.objCurrent, 'offsetTop');
		var iTolerance = 40;
		var objList, iLeft, iRight, iTop, iBottom, iCounter;

		for (iCounter=0; iCounter<drag.arTargets.length; iCounter++)
		{
			if (drag.arTargets[iCounter] != strExisting)
			{
				// Get position of the list
				objList = document.getElementById(drag.arTargets[iCounter]);
				iLeft = drag.calculatePosition(objList, 'offsetLeft') - iTolerance;
				iRight = iLeft + objList.offsetWidth + iTolerance;
				iTop = drag.calculatePosition(objList, 'offsetTop') - iTolerance;
				iBottom = iTop + objList.offsetHeight + iTolerance;

				// Determine if current object is over the target
				if (iCurrentLeft > iLeft && iCurrentLeft < iRight && iCurrentTop > iTop && iCurrentTop < iBottom)
				{
					return drag.arTargets[iCounter];
				}
			}
		}

		// Current object is not over a target
		return '';
	},

	dropObject : function(strTarget)
	{
		var objClone, objOriginal, objTarget, objEmpty, objBands, objItem;

		drag.removePopup();

		if (strTarget.length > 0)
		{
			// Copy node to new target
			objOriginal = drag.objCurrent.parentNode;
			objClone = drag.objCurrent.cloneNode(true);

			// Remove previous attributes
			objClone.removeAttribute('style');
			objClone.className = objClone.className.replace(/\s*focused/, '');
			objClone.className = objClone.className.replace(/\s*hover/, '');

			// Add focus indicators
			objClone.onfocus = function() {this.className += ' focused'; };
			objClone.onblur = function() {this.className = this.className.replace(/\s*focused/, '');};
			objClone.onmouseover = function() {if (this.className.indexOf('hover') < 0) {this.className += ' hover';} };
			objClone.onmouseout = function() {this.className = this.className.replace(/\s*hover/, ''); };

			objTarget = document.getElementById(strTarget);
			objOriginal.removeChild(drag.objCurrent);
			objTarget.appendChild(objClone);
			drag.objCurrent = objClone;
			drag.initialise(objClone);

			// Remove empty node if there are artists in list
			objEmpty = getElementsByClassName(objTarget, 'div', 'empty');
			if (objEmpty[0])
			{
				objTarget.removeChild(objEmpty[0]);
			}

			// Add an empty node if there are no artists in list
			objBands = objOriginal.getElementsByTagName('div');
			if (objBands.length === 0)
			{
				objItem = document.createElement('div');
				objItem.appendChild(document.createTextNode('Drag activities here...'));
				objItem.className = 'empty';
				objOriginal.appendChild(objItem);
			}
		}
				// Reset properties
		drag.objCurrent.style.left = '0px';
		drag.objCurrent.style.top = '0px';

		drag.objCurrent.style.zIndex = 'auto';
		drag.objCurrent.setAttribute('aria-grabbed', 'false');
		drag.objCurrent.removeAttribute('aria-owns');

		drag.identifyTargets(false);
	},

	end : function()
	{
		var strTarget = drag.getTarget();

		drag.dropObject(strTarget);

		document.onmousemove = null;
		document.onmouseup   = null;
		drag.objCurrent = null;
	}
};

function init ()
{
	var objItems = getElementsByClassName(document, 'div', 'draggable');
	var objItem, iCounter;

	for (iCounter=0; iCounter<objItems.length; iCounter++)
	{
		// Set initial values so can be moved
		objItems[iCounter].style.top = '0px';
		objItems[iCounter].style.left = '0px';

		// Put the list items into the keyboard tab order
		objItems[iCounter].tabIndex = 0;

		// Set ARIA attributes for artists
		objItems[iCounter].setAttribute('aria-grabbed', 'false');
		objItems[iCounter].setAttribute('aria-haspopup', 'true');
		objItems[iCounter].setAttribute('role', 'listitem');

		// Provide a focus indicator
		objItems[iCounter].onfocus = function() {this.className += ' focused'; };
		objItems[iCounter].onblur = function() {this.className = this.className.replace(/\s*focused/, '');};
		objItems[iCounter].onmouseover = function() {if (this.className.indexOf('hover') < 0) {this.className += ' hover';} };
		objItems[iCounter].onmouseout = function() {this.className = this.className.replace(/\s*hover/, ''); };

		drag.initialise(objItems[iCounter]);
	}

	// Set ARIA properties on the drag and drop list, and set role of this region to application
	for (iCounter=0; iCounter<drag.arTargets.length; iCounter++)
	{
		objItem = document.getElementById(drag.arTargets[iCounter]);
		objItem.setAttribute('aria-labelledby', drag.arTargets[iCounter] + 'h');
		objItem.setAttribute('role', 'list');
	}

	objItem = document.getElementById('dragdrop');
	objItem.setAttribute('role', 'application');
	

	objItems = null;
}

hideNext();
// numberOfDivs();

window.onload = init;