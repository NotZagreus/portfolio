<template>
    <section class="about">
        <button class="cv-button" @click="showModal = true">
            Download CV
        </button>
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="showModal = false">&times;</span>
                <h2>Select Language</h2>
                <select v-model="selectedLanguage" class="cv-select">
                    <option value="" disabled>Select Language</option>
                    <option value="en">English</option>
                    <option value="fr">French</option>
                </select>
                <button class="cv-button" @click="downloadSelectedCV">
                    Download
                </button>
            </div>
        </div>
    </section>
</template>

<script>
import cvEn from '@/assets/Resume EN - Artem Kozlov.pdf';
import cvFr from '@/assets/Resume FR - Artem Kozlov.pdf';

export default {
    data() {
        return {
            selectedLanguage: '',
            showModal: false,
            cvFiles: {
                en: cvEn,
                fr: cvFr
            }
        };
    },
    methods: {
        downloadSelectedCV() {
            if (this.selectedLanguage && this.cvFiles[this.selectedLanguage]) {
                this.downloadCV(this.cvFiles[this.selectedLanguage]);
                this.showModal = false;
            } else {
                alert('Please select a valid language');
            }
        },
        downloadCV(path) {
            if (!path) return;
            window.open(path, '_blank');
        }
    }
};
</script>

<style scoped>
.about {
    text-align: center;
    padding: 20px;
}

.cv-select {
    padding: 10px;
    margin: 10px;
    font-size: 16px;
}

.cv-button {
    background-color: #3f3f3f;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 10px 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.cv-button:hover {
    background-color: #616161;
}

.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);
}

.modal-content {
    background-color: hsl(212, 19%, 15%);
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    margin: auto;
    padding: 20px;
    width: 90%;
    max-width: 500px;
    text-align: center;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
        display: flex;
        align-items: center;
        flex-direction: column;
    }
}

@media (max-width: 600px) {
    .modal-content {
        width: 95%;
        padding: 10px;
    }

    .cv-button {
        padding: 10px 20px;
        font-size: 14px;
    }

    .cv-select {
        padding: 8px;
        font-size: 14px;
    }
}
</style>
