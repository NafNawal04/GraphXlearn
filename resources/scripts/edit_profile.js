fetch('/dashboard/profile/data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('name').value = data.name || '';
            document.getElementById('email').value = data.email || '';
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            document.getElementById('message').className = 'error';
            document.getElementById('message').innerText = 'Error loading profile data.';
        });

    document.getElementById('editProfileForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        fetch('/dashboard/profile/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update profile.');
            }
            return response.json();
        })
        .then(data => {
            const messageDiv = document.getElementById('message');
            messageDiv.className = 'success';
            messageDiv.innerText = 'Profile updated successfully!';

            setTimeout(() => {
                window.location.href = '/dashboard/profile';
            }, 2000); 
        })

        .catch(error => {
            console.error('Error updating profile:', error);
            document.getElementById('message').className = 'error';
            document.getElementById('message').innerText = 'Error updating profile. Please try again.';
        });
    });