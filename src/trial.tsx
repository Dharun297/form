import React, { useState } from "react";

const MerchantForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [paymentOption, setPaymentOption] = useState<string>("Internet Banking");
  const [criticalAccount, setCriticalAccount] = useState<string[]>([]);
  const [merchantData, setMerchantData] = useState<any[]>([]);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>("All");
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const handlePaymentOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentOption(e.target.value);
  };

  const handleCriticalAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (criticalAccount.includes(value)) {
      setCriticalAccount(criticalAccount.filter((item) => item !== value));
    } else {
      setCriticalAccount([...criticalAccount, value]);
    }
  };

  const editMerchant = (index: number) => {
    const merchantToEdit = merchantData[index];
    setName(merchantToEdit.name);
    setEmail(merchantToEdit.email);
    setPhone(merchantToEdit.phone);
    setCategory(merchantToEdit.category);
    setPaymentOption(merchantToEdit.paymentOption);
    setCriticalAccount(merchantToEdit.criticalAccount);
    setEditingIndex(index);
  };

  const handleEdit = (index: number) => {
    editMerchant(index);
  };

  const handleDelete = (index: number) => {
    const updatedMerchants = [...merchantData];
    updatedMerchants.splice(index, 1);
    setMerchantData(updatedMerchants);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Placeholder for calculateCommission function
    const calculatedCommission = calculateCommission();

    const newMerchant = {
      name,
      email,
      phone,
      category,
      paymentOption,
      criticalAccount,
      commission: calculatedCommission,
    };

    if (editingIndex !== -1) {
      const updatedMerchants = [...merchantData];
      updatedMerchants[editingIndex] = newMerchant;
      setMerchantData(updatedMerchants);
      setEditingIndex(-1);
    } else {
      setMerchantData([...merchantData, newMerchant]);
    }

    // Clear form fields
    setName("");
    setEmail("");
    setPhone("");
    setCategory("");
    setPaymentOption("Internet Banking");
    setCriticalAccount([]);
  };

  const calculateCommission = () => {
    let calculatedCommission = 0;

    if (paymentOption === "Internet Banking") {
      calculatedCommission = 0.02;
    } else if (paymentOption === "Cash On Delivery") {
      calculatedCommission = 0.05; 
    } else if (paymentOption === "UPI") {
      calculatedCommission = 0.03;
    }

    return calculatedCommission;
  };

  const filterMerchantData = () => {
    let filteredData =  [...merchantData];

    if (selectedPaymentOption !== "All") {
      filteredData = filteredData.filter(
        (merchant) => merchant.paymentOption === selectedPaymentOption
      );
    }

    return filteredData;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />

        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />

        <label>Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <br />

        <label>Category</label>
        <input
          type="text"
          value={category}
          onChange={handleCategoryChange}
        />
        <br />

        <label>Payment Options</label>
        <div>
          <input
            type="radio"
            id="internetBanking"
            name="paymentOption"
            value="Internet Banking"
            checked={paymentOption === "Internet Banking"}
            onChange={handlePaymentOptionChange}
          />
          <label htmlFor="internetBanking">Internet Banking</label>
        </div>
        <div>
          <input
            type="radio"
            id="cashOnDelivery"
            name="paymentOption"
            value="Cash On Delivery"
            checked={paymentOption === "Cash On Delivery"}
            onChange={handlePaymentOptionChange}
          />
          <label htmlFor="cashOnDelivery">Cash On Delivery</label>
        </div>
        <div>
          <input
            type="radio"
            id="upi"
            name="paymentOption"
            value="UPI"
            checked={paymentOption === "UPI"}
            onChange={handlePaymentOptionChange}
          />
          <label htmlFor="upi">UPI</label>
        </div>
        <br />

        <label>Critical Account</label>
        <div>
          <input
            type="checkbox"
            id="account1"
            name="criticalAccount"
            value="Account 1"
            checked={criticalAccount.includes("Account 1")}
            onChange={handleCriticalAccountChange}
          />
          <label htmlFor="account1">Account 1</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="account2"
            name="criticalAccount"
            value="Account 2"
            checked={criticalAccount.includes("Account 2")}
            onChange={handleCriticalAccountChange}
          />
          <label htmlFor="account2">Account 2</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="account3"
            name="criticalAccount"
            value="Account 3"
            checked={criticalAccount.includes("Account 3")}
            onChange={handleCriticalAccountChange}
          />
          <label htmlFor="account3">Account 3</label>
        </div>
        <br />

        <button type="submit">Submit</button>
      </form>

      <h2>Filter Payment Options</h2>
      <select
        value={selectedPaymentOption}
        onChange={(e) => setSelectedPaymentOption(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Internet Banking">Internet Banking</option>
        <option value="Cash On Delivery">Cash On Delivery</option>
        <option value="UPI">UPI</option>
      </select>

      <h2>Merchant Data</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Category</th>
            <th>Payment Option</th>
            <th>Critical Account</th>
            <th>Edit/Delete</th>
          </tr>
        </thead>
        <tbody>
          {filterMerchantData().map((merchant, index) => (
            <tr key={index}>
              <td>{merchant.name}</td>
              <td>{merchant.email}</td>
              <td>{merchant.phone}</td>
              <td>{merchant.category}</td>
              <td>{merchant.paymentOption}</td>
              <td>{merchant.criticalAccount.join(", ")}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MerchantForm;
