import { useEffect } from "react";
import API from "../config/apiConfig";

const AcceptTransaction = () => {

    const acceptRequest = async (requestId: string, sellerUsername: string, buyerUsername: string) => {
        if (!window.hive_keychain) {
            alert("Hive Keychain is required to accept the request.");
            return;
        }
    
        const transactionData = {
            seller: sellerUsername,
            buyer: buyerUsername,
            dnaRequestId: requestId,
        };
    
        // window.hive_keychain.requestCustomJson(
        //     sellerUsername,
        //     "dna_transaction",
        //     "Active",
        //     JSON.stringify(transactionData),
        //     "DNA Transaction",
        //     async (response) => {
        //         if (response.success) {
        //             alert("Transaction successful! Updating backend...");
    
        //             // Step 4: Notify Backend to Update Access
        //             await API.post("/dna/accept-request", {
        //                 requestId,
        //                 sellerUsername,
        //                 buyerUsername,
        //             });
    
        //             alert("Buyer has been granted access.");
        //         } else {
        //             alert("Transaction failed!");
        //         }
        //     }
        // );


        window.hive_keychain.requestTransfer(
            sellerUsername,
            buyerUsername,
            "0.000 HIVE",
            "DNA Transaction",
            "Active",
            (transferResponse) => {
                if (transferResponse.success) {
                    console.log("0-Hive Transaction Successful");

                    if (!window.hive_keychain) {
                        alert("Hive Keychain is required to accept the request.");
                        return;
                    }
        
                    // Now broadcast metadata about the transaction
                    window.hive_keychain.requestCustomJson(
                        sellerUsername,
                        "dna_transaction",
                        "Active",
                        JSON.stringify({
                            seller: sellerUsername,
                            buyer: buyerUsername,
                            dnaRequestId: requestId,
                        }),
                        "DNA Transaction Metadata",
                        (jsonResponse) => {
                            if (jsonResponse.success) {
                                console.log("Transaction metadata recorded on Hive");
                            } else {
                                console.error("Metadata transaction failed:", jsonResponse.error);
                            }
                        }
                    );
                } else {
                    console.error("0-Hive transaction failed:", transferResponse.error);
                }
            }
        );
        
    };

    return (
        <button onClick={() => acceptRequest()}>Accept</button>
    )
}

export default AcceptTransaction