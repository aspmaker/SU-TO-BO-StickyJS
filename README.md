# SU-TO-BO-StickyJS
It is an alternative pure javascript work for css sticky position style. Because css sticky elements are not working when their container has "overflow:hidden;" 

**Usage**:  
Which html element you want to be a sticky element, you must add a class with name ".stickyElement". js code searches for this class to find the normal html element and convert it into a sticky element. 
  >**Example**:  
      `<button style="background-color:red;" class="stickyElement">Top Sticky Button</button>`
        
If you want to set another element as a top border for the sticky element, you must specify the "id" property of the element you want to set as a border.  Attribute nama is "**data-stickyTopBorder**"
  >**Example**:  
      `<button style="background-color:red;" class="stickyElement" data-stickyTopBorder="parentDiv">Top Sticky Button</button>`
       
&nbsp;   
If you want to set another element as a bottom border for the sticky element, you must specify the "id" property of the element you want to set as a border.  Attribute nama is "**data-stickyBottomBorder**"
  >**Example**:  
      `<button style="background-color:red;" class="stickyElement" data-stickyBottomBorder="parentDiv">Top Sticky Button</button>`
       
&nbsp;   
Auto run,find and replace sticky element:      
Code is start with observable methods and do everything itself. And it always listens to the dom for new elements, in case they have the '.sticky Element' class.
>   `observerElement();`

&nbsp;      
**Alternative run:**    
When dom ready or something else you can call and run this function for create all your stciky elements:     
> `createAllStickyElement();`
      
