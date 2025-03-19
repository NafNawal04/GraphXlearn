fetch('/dashboard/profile/data')
.then(response => response.json())
.then(data => {
    document.getElementById('welcomeText').innerText = `Welcome, ${data.name}!`;
})
.catch(err => console.error(err));

const userIcon = document.getElementById('userIcon');
const dropdownMenu = document.getElementById('dropdownMenu');

userIcon.addEventListener('click', () => {
dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
});

document.addEventListener('click', (event) => {
if (!userIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.style.display = 'none';
}
});