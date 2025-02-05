<template>
    <div class="contact-view">
        <button @click="showModal = true">Contact Me</button>
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="showModal = false">&times;</span>
                <h1>Contact Me</h1>
                <form @submit.prevent="sendEmail">
                    <div>
                        <label for="firstName">First Name:</label>
                        <input type="text" id="firstName" v-model="firstName" required />
                    </div>
                    <div>
                        <label for="lastName">Last Name:</label>
                        <input type="text" id="lastName" v-model="lastName" required />
                    </div>
                    <div>
                        <label for="email">Email:</label>
                        <input type="email" id="email" v-model="email" required />
                    </div>
                    <div>
                        <label for="message">Message:</label>
                        <textarea id="message" v-model="message" required></textarea>
                    </div>
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showModal: false,
            firstName: '',
            lastName: '',
            email: '',
            message: ''
        };
    },
    methods: {
        async sendEmail() {
            const response = await fetch(`http://localhost:14344/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: 'jhondoesnthack@gmail.com',
                    subject: `Portfolio: Contact from ${this.firstName} ${this.lastName}`,
                    text: `${this.firstName} ${this.lastName} has contacted you about your portfolio from ${this.email}, and here's what they said:\n\n${this.message}`
                })
            });

            if (response.ok) {
                alert('Email sent successfully!');
                this.firstName = '';
                this.lastName = '';
                this.email = '';
                this.message = '';
                this.showModal = false;
            } else {
                alert('Failed to send email.');
            }
        }
    }
};
</script>

<style scoped>
.contact-view {
    text-align: center;
    padding: 20px;
}

button {
    padding: 10px 20px;
    cursor: pointer;
}

.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    background-color: hsl(212, 19%, 15%);
    padding: 20px;
    border-radius: 5px;
    width: 80%;
    max-width: 600px;
    position: relative;
    text-align: left;
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
}

form div {
    margin-bottom: 10px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input, textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}
</style>