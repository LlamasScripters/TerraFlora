<template>
    <div class="flex items-center justify-center my-20">
        <div class="w-full container max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <h2 class="text-3xl font-semibold text-center text-gray-900">Reinitialisez votre mot de passe</h2>
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div>
                        <label for="email" class="sr-only">Email</label>
                        <input v-model="email" id="email" name="email" type="email" required
                            class="relative block w-full px-3 py-3 text-[14px] bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300  focus:outline-none sm:text-sm"
                            placeholder="Entrez votre email" />
                    </div>
                </div>
                <div>
                    <button type="submit"
                        class="relative flex justify-center px-4 py-2 text-md font-medium text-white bg-red-600 border border-transparent group hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Envoyer
                    </button>
                </div>
                <div v-if="success" class="text-green-500">{{ success }}</div>
                <div v-if="error" class="text-red-500">{{ error }}</div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const error = ref('')
const success = ref('')

const handleSubmit = async () => {
    try {
        const response = await axios.post(import.meta.env.VITE_API_URL + 'auth/forgot-password', {
            email: email.value
        })
        success.value = 'Si un compte avec cette adresse e-mail existe, un lien de réinitialisation du mot de passe a été envoyé.'
        error.value = ''
    } catch (err) {
        error.value = err.response?.data?.error || 'An error occurred.'
        success.value = ''
    }
}
</script>

<style scoped>
.container {
    max-width: 500px;
}
</style>
