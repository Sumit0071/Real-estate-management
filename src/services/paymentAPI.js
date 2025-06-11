export const paymentAPI = {
    // Create Razorpay order
    createOrder: async ( amount, currency ) => {
        try {
            const token = localStorage.getItem( 'authToken' ); // or however you store your token
            const BASEURL = import.meta.env.VITE_BACKEND_URL;

            const response = await fetch( `${BASEURL}/api/payments/create-order?amount=${amount}&currency=${currency}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // ADD THIS LINE
                },
            } );

            if ( !response.ok ) {
                throw new Error( 'Failed to create payment order' );
            }

            return await response.json();
        } catch ( error ) {
            console.error( 'Error creating order:', error );
            throw error;
        }
    },
    // Get payment status (if implemented later)
    getPaymentStatus: async ( transactionId ) => {
        try {
            const response = await fetch( `/api/payments/status/${transactionId}` );

            if ( !response.ok ) {
                throw new Error( 'Failed to fetch payment status' );
            }

            return await response.json();
        } catch ( error ) {
            throw error;
        }
    }
};
