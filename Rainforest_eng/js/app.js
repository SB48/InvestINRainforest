// Variables
const basket = document.querySelector('#basket');
const courseList = document.querySelector('#course-list');
const basketContainer = document.querySelector('#basket-list tbody');
const clearBasketBtn = document.querySelector('#clear-basket');
let basketItems = [];

// Listeners
loadEventListeners();

function loadEventListeners() {
     // Triggered when "Add To Basket" button is clicked
     courseList.addEventListener('click', addCourse);

     // Triggered when a course is removed from the basket
     basket.addEventListener('click', removeCourse);

     // When clearing the basket
     clearBasketBtn.addEventListener('click', clearBasket);

     // NEW: Loaded content
     document.addEventListener('DOMContentLoaded', () => {
          basketItems = JSON.parse( localStorage.getItem('basket') ) || []  ;
          // console.log(basketItems);
          basketHTML();
     });
}

// Function to add the course to the basket
function addCourse(e) {
     e.preventDefault();
     // Delegation for add-to-basket
     if(e.target.classList.contains('add-to-basket')) {
          const course = e.target.parentElement.parentElement;
          // Send the selected course to get its data
          readCourseData(course);
     }
}

// Read the course data
function readCourseData(course) {
     const courseInfo = {
          image: course.querySelector('img').src,
          title: course.querySelector('h4').textContent,
          price: course.querySelector('.price span').textContent,
          id: course.querySelector('a').getAttribute('data-id'),
          amount: 1
     }


     if( basketItems.some( course => course.id === courseInfo.id ) ) {
          const courses = basketItems.map( course => {
               if( course.id === courseInfo.id ) {
                    let amount = parseInt(course.amount);
                    amount++
                    course.amount =  amount;
                    return course;
               } else {
                    return course;
               }
          })
          basketItems = [...courses];
     }  else {
          basketItems = [...basketItems, courseInfo];
     }

     console.log(basketItems)

     

     // console.log(basketItems)
     basketHTML();
}

// Remove the course from the basket in the DOM
function removeCourse(e) {
     e.preventDefault();
     if(e.target.classList.contains('delete-course') ) {
          // e.target.parentElement.parentElement.remove();
          const course = e.target.parentElement.parentElement;
          const courseId = course.querySelector('a').getAttribute('data-id');

          // Remove from the basket
          basketItems = basketItems.filter(course => course.id !== courseId);

          basketHTML();
     }
}

// Show the selected course in the basket
function basketHTML() {

     clearBasket();

     basketItems.forEach(course => {
          const row = document.createElement('tr');
          row.innerHTML = `
               <td>  
                    <img src="${course.image}" width=100>
               </td>
               <td>${course.title}</td>
               <td>${course.price}</td>
               <td>${course.amount} </td>
               <td>
                    <a href="#" class="delete-course" data-id="${course.id}">X</a>
               </td>
          `;
          basketContainer.appendChild(row);
     });

     // NEW:
     syncStorage();

}


// NEW:
function syncStorage() {
     localStorage.setItem('basket', JSON.stringify(basketItems));
}

// Remove the courses from the basket in the DOM
function clearBasket() {
     // quick way (recommended)
     while(basketContainer.firstChild) {
          basketContainer.removeChild(basketContainer.firstChild);
      }
}
