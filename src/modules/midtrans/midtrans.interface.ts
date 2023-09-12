export interface CreateTransaction {
    transaction_details: {
        order_id: string;
        gross_amount: number;
    },
    credit_card?: {
        secure?: boolean;
    },
    customer_details: {
        first_name: string;
        last_name: string;
        email: string;
    }
}