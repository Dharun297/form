import axios from "axios";
import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
axios.defaults.baseURL = "http://localhost:4000/student";


interface Merchant {
  name: string;
  email: string;
  mobilenumber: string;
  website: string;
  contactname: string;
  contactnumber: string;
  contactemail: string;
  notes: string;
  businesstype: string | undefined;
  category: string;
  comissionpercentage: number | string;
  activefrom: string;
  paymentOption: string;
  criticalAccount: string[];
}

const MerchantForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobilenumber, setmobilenumber] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [contactname, setcontactname] = useState<string>("");
  const [contactnumber, setcontactnumber] = useState<string>("");
  const [contactemail, setcontactemail] = useState<string>("");
  const [notes, setnotes] = useState<string>("");
  const [businesstype, setbusinesstype] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string>("");
  const [comissionpercentage, setComissionPercentage] = useState<string>("");
  const [activefrom, setActiveFrom] = useState<string>("");
  const [criticalAccount, setCriticalAccount] = useState<string[]>([]);
  const [paymentOption, setPaymentOption] = useState<string>("");
  const [merchantData, setMerchantData] = useState<Merchant[]>([]);
  const [selectedPaymentOption, setSelectedPaymentOption] =    useState<string>("All");
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  useEffect(() => {
    // Fetch merchant data from the backend when the component mounts
    axios
      .get("/") // Changed post to get for fetching data
      .then((response) => {
        setMerchantData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handlePaymentOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentOption(e.target.value);
  };

  const handleCriticalAccountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    setmobilenumber(merchantToEdit.mobilenumber);
    setWebsite(merchantToEdit.website);
    setcontactname(merchantToEdit.contactname);
    setcontactnumber(merchantToEdit.contactnumber);
    setcontactemail(merchantToEdit.contactemail);
    setnotes(merchantToEdit.notes);
    setbusinesstype(merchantToEdit.businesstype);
    setComissionPercentage(String(merchantToEdit.comissionpercentage));
    setActiveFrom(new Date(merchantToEdit.activefrom).toISOString());
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Placeholder for calculateCommission function
    const calculatedCommission = calculateCommission();
  
    const newMerchant: Merchant = {
      name,
      email,
      mobilenumber,
      website,
      contactname,
      contactnumber,
      contactemail,
      businesstype,
      notes,
      criticalAccount,
      category,
      comissionpercentage,
      activefrom,
      paymentOption,
    };
  
    try {
      const response = await axios.post('http://localhost:4000/student', newMerchant);
      console.log('New merchant created:', response.data);
      // Handle success, update state, or perform necessary actions
    } catch (error) {
      console.error('Error creating new merchant:', error);
      // Handle error
    }
  
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
    setmobilenumber("");
    setWebsite("");
    setcontactname("");
    setcontactnumber("");
    setcontactemail("");
    setbusinesstype("");
    setnotes("");
    setPaymentOption("");
    setCriticalAccount([]);
    setComissionPercentage("");
    setActiveFrom("");
  
    return null; // Add this line to resolve the TypeScript error
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
    let filteredData = [...merchantData];

    if (selectedPaymentOption !== "All") {
      filteredData = filteredData.filter(
        (merchant) => merchant.paymentOption === selectedPaymentOption
      );
    }

    return filteredData;
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setbusinesstype(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };
  const handleComissionPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setComissionPercentage(e.target.value);
  };
  return (
    <div>
      <h1>Merchant Form</h1>
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

        <label>Phone Number</label>
        <input
          type="tel"
          value={mobilenumber}
          onChange={(e) => setmobilenumber(e.target.value)}
        />
        <br />

        <label>Website</label>
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <br />
        <label>Contact Name</label>
        <input
          type="text"
          value={contactname}
          onChange={(e) => setcontactname(e.target.value)}
        />
        <br />
        <label>Contact Number</label>
        <input
          type="text"
          value={contactnumber}
          onChange={(e) => setcontactnumber(e.target.value)}
        />
        <br />
        <label>Contact Email</label>
        <input
          type="text"
          value={contactemail}
          onChange={(e) => setcontactemail(e.target.value)}
        />
        <div>
          <label>Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setnotes(e.target.value)}
          />
        </div>

        <div>
          <h4>Business Type</h4>
          <input
            type="radio"
            id="smallBusiness"
            name="businesstype"
            value="Small Business"
            checked={businesstype === "Small Business"}
            onChange={handleTitleChange}
          />
          <label htmlFor="smallBusiness">Small Business</label>
        </div>
        <div>
          <input
            type="radio"
            id="enterprise"
            name="business"
            value="Enterprise"
            checked={businesstype === "Enterprise"}
            onChange={handleTitleChange}
          />
          <label htmlFor="enterprise">Enterprise</label>
        </div>
        <div>
          <input
            type="radio"
            id="entrepreneur"
            name="business"
            value="Entrepreneur"
            checked={businesstype === "Entrepreneur"}
            onChange={handleTitleChange}
          />
          <label htmlFor="entrepreneur">Entrepreneur</label>
        </div>

        <h4>Category</h4>
        <select value={category} onChange={handleCategoryChange}>
          <option value="Toys">Toys</option>
          <option value="clothes">Clothes</option>
          <option value="Groceries">Groceries</option>
          <option value="electronics">Electronics</option>
          <option value="digital">Digital</option>
        </select>
        <label>Comission Percentage</label>
        <input
          type="text"
          value={comissionpercentage}
          onChange={handleComissionPercentageChange}
        />
       <label>Activeform</label>
       <input
  type="date"
  name="ActiveFrom"
  id="date"
  value={activefrom}
  onChange={(event) => setActiveFrom(event.target.value)}
/>        
        <h4>Payment Options</h4>
        <input
          type="radio"
          id="internetBanking"
          name="paymentOption"
          value="Internet Banking"
          checked={paymentOption === "Internet Banking"}
          onChange={handlePaymentOptionChange}
        />
        <label htmlFor="internetBanking">Internet Banking</label>
        <div />

        <input
          type="radio"
          id="cashOnDelivery"
          name="paymentOption"
          value="Cash On Delivery"
          checked={paymentOption === "Cash On Delivery"}
          onChange={handlePaymentOptionChange}
        />
        <label htmlFor="cashOnDelivery">Cash On Delivery</label>
        <div />
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
            id="yes"
            name="criticalAccount"
            value="Yes"
            checked={criticalAccount.includes("Yes")}
            onChange={handleCriticalAccountChange}
          />
          <label htmlFor="account1">Yes</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="no"
            name="No"
            value="No"
            checked={criticalAccount.includes("No")}
            onChange={handleCriticalAccountChange}
          />
          <label htmlFor="no">No</label>
        </div>

        <button type="submit">Submit</button>
      </form>

      <h2>Filter Payment Options</h2>
      <select
        className="filter"
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
            <th>Mobile Number</th>
            <th>Website</th>
            <th>Contact Name</th>
            <th>Contact Number</th>
            <th>Contact Email</th>
            <th>Notes</th>
            <th>Business Type</th>
            <th>Selected Category</th>
            <th>Comission Percentage</th>
            <th>Active From</th>
             <th>Critical Account</th>
            <th>Payment Option</th>
            <th>Edit/Delete</th>
          </tr>
        </thead>
        <tbody>
          {filterMerchantData().map((merchant, index) => (
            <tr key={index}>
              <td>{merchant.name}</td>
              <td>{merchant.email}</td>
              <td>{merchant.mobilenumber}</td>
              <td>{merchant.website}</td>
              <td>{merchant.contactname}</td>
              <td>{merchant.contactnumber}</td>
              <td>{merchant.contactemail}</td>
              <td>{merchant.notes}</td>
              <td>{merchant.businesstype}</td>
              <td>{merchant.category}</td>
              <td>{merchant.comissionpercentage}</td>
              <td>{merchant.activefrom}</td>
              <td>{merchant.criticalAccount ? merchant.criticalAccount.join(", ") : ''}</td>

              <td>{merchant.paymentOption}</td>

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