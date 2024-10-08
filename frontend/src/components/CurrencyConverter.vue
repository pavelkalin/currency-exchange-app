<script setup>
import { onMounted, reactive } from 'vue';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const state = reactive({
  currencies: [
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'ILS', value: 'ILS' },
  ],
  isCurrenciesLoading: true,
  isConversionLoading: true,
  selectedFromCurrency: 'USD',
  selectedToCurrency: 'ILS',
  conversionResult: 100,
  amount: 100,
  pair: 'USD/ILS',
  rate: 1,
});

const swap = async () => {
  const swappedCurrency = state.selectedToCurrency;
  state.selectedToCurrency = state.selectedFromCurrency;
  state.selectedFromCurrency = swappedCurrency;
  state.pair = `${state.selectedFromCurrency}/${state.selectedToCurrency}`;
  await convertCurrencies();
};

const onCurrencyChange = async () => {
  state.pair = `${state.selectedFromCurrency}/${state.selectedToCurrency}`;
  await convertCurrencies();
};

const convertCurrencies = async () => {
  try {
    state.isConversionLoading = true;
    const response = await axios.post(`${BASE_URL}/api/convert`, {
      baseCurrency: state.selectedFromCurrency,
      targetCurrency: state.selectedToCurrency,
      amount: state.amount,
    });
    state.conversionResult = response.data.amount;
    state.rate = response.data.conversionRate;
  } catch (error) {
    console.error('Error fetching job', error);
  } finally {
    state.isConversionLoading = false;
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/currencies`);
    state.currencies = response.data.map((el) => ({ label: el, value: el }));
    await convertCurrencies();
  } catch (error) {
    console.error('Error fetching job', error);
  } finally {
    state.isCurrenciesLoading = false;
  }
});
</script>

<template>
  <div>
    <form
      class="mx-auto w-full max-w-sm bg-white shadow rounded-md p-5 space-y-3 text-sm"
      @submit.prevent="submit"
    >
      <div v-if="state.isCurrenciesLoading" class="text-center">
        <i
          class="pi pi-spin pi-spinner text-center"
          style="font-size: 4rem"
        ></i>
      </div>
      <div v-else>
        <div class="mb-4">
          <label
            for="baseCurrency"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Select from currency</label
          >
          <select
            id="baseCurrency"
            v-model="state.selectedFromCurrency"
            @change="onCurrencyChange"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option
              v-for="currency in state.currencies"
              :key="currency.value"
              :value="currency.value"
            >
              {{ currency.label }}
            </option>
          </select>
        </div>
        <div class="mb-4 text-center text-gray-500 dark:text-gray-400">
          <button
            class="pi pi-sync rounded-md bg-slate-800 p-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:bg-slate-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-opacity-50 active:bg-slate-900 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
            style="font-size: 1rem"
            @click.prevent="swap"
          ></button>
        </div>
        <div class="mb-4">
          <label
            for="targetCurrency"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Select to currency</label
          >
          <select
            id="targetCurrency"
            v-model="state.selectedToCurrency"
            @change="onCurrencyChange"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option
              v-for="currency in state.currencies"
              :key="currency.value"
              :value="currency.value"
            >
              {{ currency.label }}
            </option>
          </select>
        </div>
        <div class="flex items-center justify-between space-x-5">
          <label for="amount">Amount</label>
          <input
            v-model="state.amount"
            type="number"
            min="0"
            name="amount"
            class="border-slate-300 border rounded-md py-2 px-4 text-sm"
            @change="convertCurrencies"
            @input="state.amount = Math.abs(state.amount)"
          />
        </div>
        <div class="flex items-center justify-between space-x-5">
          <label>Conversion result:</label>
          <div
            v-if="state.isConversionLoading"
            class="border rounded-md py-2 px-4 text-sm"
          >
            <i
              class="pi pi-spin pi-spinner text-center"
              style="font-size: 1rem"
            ></i>
          </div>
          <div v-else class="border rounded-md py-2 px-4 text-sm">
            {{ state.conversionResult }}
          </div>
        </div>
        <div class="flex items-center justify-between space-x-5">
          <label>Exchange rate for {{ state.pair }}:</label>
          <div
            v-if="state.isConversionLoading"
            class="border-slate-300 border rounded-md py-2 px-4 text-sm"
          >
            <i
              class="pi pi-spin pi-spinner text-center"
              style="font-size: 1rem"
            ></i>
          </div>
          <div
            v-else
            class="border-slate-300 border rounded-md py-2 px-4 text-sm"
          >
            {{ state.rate }}
          </div>
        </div>
        <button
          type="submit"
          class="bg-slate-800 text-white rounded-md py-2 px-4 mx-auto relative block"
          @click="convertCurrencies"
        >
          Convert
        </button>
      </div>
    </form>
  </div>
</template>
