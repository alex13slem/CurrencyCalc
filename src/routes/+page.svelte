<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import type { PageData } from './$types';
	import * as Select from '../lib/components/ui/select';
	import ScrollArea from '../lib/components/ui/scroll-area/scroll-area.svelte';
	import Input from '../lib/components/ui/input/input.svelte';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import axios from 'axios';
	import type { CurrencyLatest } from '../lib/types/CurrencyLatest';
	import TablerArrowsDiff from '../lib/components/ui/icons/tabler-arrows-diff.svelte';

	export let data: PageData;

	const currencies = Object.values(data.currencies);
	let currencyLatest = data.defaultCurrencyLatest;

	let baseCurrency: string = data.baseCurrency;
	let targetCurrency: string = Object.keys(currencyLatest)[0];
	let baseCurrencyValue: number = 1;
	let targetCurrencyValue: number = currencyLatest[targetCurrency];

	$: updateTargetCurrencyValue();
	$: updateBaseCurrencyValue();

	function updateTargetCurrencyValue() {
		targetCurrencyValue = baseCurrencyValue * currencyLatest[targetCurrency];
		targetCurrencyValue = parseFloat(targetCurrencyValue.toFixed(2));
	}

	function updateBaseCurrencyValue() {
		baseCurrencyValue = targetCurrencyValue / currencyLatest[targetCurrency];
		baseCurrencyValue = parseFloat(baseCurrencyValue.toFixed(2));
	}

	function handleBaseCurrencyChange(e: InputEvent) {
		const { value } = e.target as HTMLInputElement;
		baseCurrencyValue = parseInt(value) || 0;
		updateTargetCurrencyValue();
	}

	function handleTargetCurrencyChange(e: InputEvent) {
		const { value } = e.target as HTMLInputElement;
		targetCurrencyValue = parseInt(value) || 0;
		updateBaseCurrencyValue();
	}

	async function setBaseCurrency(value: string) {
		try {
			const url = new URL(window.location.href);
			url.searchParams.set('base_currency', value);

			const response = await axios.get<CurrencyLatest>(url.origin + '/api/latest', {
				params: { base_currency: value }
			});

			currencyLatest = response.data.data;
			baseCurrency = value;
			updateTargetCurrencyValue();
			pushState(url, $page.state);
		} catch (error) {
			console.error(error);
		}
	}

	function setTargetCurrency(value: string) {
		targetCurrency = value;
		updateTargetCurrencyValue();
	}

	async function swapCurrencies() {
		try {
			const previousBaseCurrency = baseCurrency;

			baseCurrency = targetCurrency;
			targetCurrency = previousBaseCurrency;

			const url = new URL(window.location.href);
			url.searchParams.set('base_currency', baseCurrency);

			const response = await axios.get<CurrencyLatest>(url.origin + '/api/latest', {
				params: { base_currency: baseCurrency }
			});

			currencyLatest = response.data.data;
			pushState(url, $page.state);

			updateTargetCurrencyValue();
		} catch (error) {
			console.error('Ошибка при обмене валют:', error);
		}
	}
</script>

<main class="p-4">
	<div class="flex gap-4">
		<div class="border border-input rounded-lg p-1 flex gap-2">
			<Input
				value={baseCurrencyValue}
				on:input={handleBaseCurrencyChange}
				inputmode="numeric"
				type="number"
				step="1"
				min="0"
			/>
			<Select.Root
				selected={{ value: baseCurrency, label: baseCurrency }}
				onSelectedChange={(s) => s && setBaseCurrency(s.value)}
			>
				<Select.Trigger class="w-[112px] flex-shrink-0">
					<Select.Value />
				</Select.Trigger>
				<Select.Content>
					<ScrollArea class="h-60">
						{#each currencies as c}
							<Select.Item value={c.code}>{c.code}</Select.Item>
						{/each}
					</ScrollArea>
				</Select.Content>
			</Select.Root>
		</div>
		<button class="flex-shrink-0 text-xl" on:click={swapCurrencies}>
			<TablerArrowsDiff />
		</button>
		<div class="border border-input rounded-lg p-1 flex gap-2">
			<Input
				value={targetCurrencyValue}
				on:input={handleTargetCurrencyChange}
				inputmode="numeric"
				type="number"
				step="1"
				min="0"
			/>
			<Select.Root
				selected={{ value: targetCurrency, label: targetCurrency }}
				onSelectedChange={(s) => s && setTargetCurrency(s.value)}
			>
				<Select.Trigger class="w-[112px] flex-shrink-0">
					<Select.Value />
				</Select.Trigger>
				<Select.Content>
					<ScrollArea class="h-60">
						{#each currencies as c}
							<Select.Item value={c.code}>{c.code}</Select.Item>
						{/each}
					</ScrollArea>
				</Select.Content>
			</Select.Root>
		</div>
	</div>
</main>

<ModeWatcher />
