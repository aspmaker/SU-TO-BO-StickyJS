# SU-TO-BO-StickyJS
İt is an alternative javascript work for css sticky position style. Because css sticky elements are not working when their container has "overflow:hidden;" 

**Usage**:  
Which html element you want to be a sticky element, you must add a class with name ".stickyElement". js code searches for this class to find the normal html element and convert it into a sticky element. 
  >**Example**:  
      `<button style="background-color:red;" class="stickyElement">Top Sticky Button</button>`
        
If you want to set another element as a border for the sticky element, you must specify the "id" property of the element you want to set as a border.  
  >**Example**:  
      `<button style="background-color:red;" class="stickyElement" data-stickyParent="parentDiv">Top Sticky Button</button>` 
      
