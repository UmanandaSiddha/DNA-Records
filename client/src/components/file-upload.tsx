import { useState } from "react";
import API from "../config/apiConfig";

const FileUpload = () => {

    const [file, setFile] = useState<File | null>(null);
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const username = localStorage.getItem("hive_user");

    const handleUpload = async () => {
        if (!file || !username) {
            alert("Please select a file and ensure you're logged into Hive.");
            return;
        }
        if (!window.hive_keychain) {
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("dnaFile", file);
            formData.append("price", price);
            formData.append("userId", username);

            const response = await API.post("/dna/upload", formData);
            const { dnaFile } = response.data;

            const transactionData = {
                user: username,
                dnaHash: dnaFile.fileHash,
                price,
                timestamp: Date.now(),
            };

            window.hive_keychain.requestCustomJson(
                username,
                "dna_records",
                "Posting",
                JSON.stringify(transactionData),
                "Upload DNA Record to Hive",
                async (response) => {
                    if (response.success) {
                        alert("DNA successfully uploaded and recorded on Hive!");
                    } else {
                        alert("Transaction failed!");
                    }
                    setLoading(false);
                }
            );
        } catch (error) {
            console.error("Upload error:", error);
            alert("DNA upload failed.");
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload DNA File</h2>
            <input type="file" accept=".txt,.csv,.pdf,.zip" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <input
                type="number"
                placeholder="Enter selling price (DNACOIN)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? "Uploading..." : "Upload DNA"}
            </button>
        </div>
    )
}

export default FileUpload;