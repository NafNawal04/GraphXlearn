const token = window.location.pathname.split('/')[2];

        const urlParams = new URLSearchParams(window.location.search);
        const resetSuccess = urlParams.get('resetSuccess');
        
        if (resetSuccess) {
            alert("Password successfully reset. You can now log in.");
            window.location.href = "/login"; 
        }

        document.querySelector('input[name="token"]').value = token;
        document.querySelector('form').action = `/reset-password/${token}`;