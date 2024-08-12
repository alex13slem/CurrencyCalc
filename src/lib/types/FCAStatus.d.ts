export interface FCAStatus {
	account_id: number;
	quotas: Quotas;
}

interface Quotas {
	month: Grace;
	grace: Grace;
}

interface Grace {
	total: number;
	used: number;
	remaining: number;
}
