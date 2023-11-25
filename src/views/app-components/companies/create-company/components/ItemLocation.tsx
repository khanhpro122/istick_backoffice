// Libraries
import { fetchCities, fetchCountries } from "@/apis/systems";
import { Input, Select } from "antd";
import React, { ChangeEvent, useEffect, useState } from "react";

type TProps = {
  companyAddresses: any[];
  onChangeOptionLocation?: (value: string, type: string, id: any) => void;
  handleClearOptionLocation?: (id: any) => void;
  item: any;
};
export const ItemLocation = ({
  onChangeOptionLocation,
  handleClearOptionLocation,
  item,
  companyAddresses
}:TProps) => {
  const [listCountries, setListCountries] = useState<any[]>([]);
  const [listCities, setListCities] = useState<any[]>([])
  
  const fetchListCountries = async () => {
    const res = await fetchCountries({limit: 10, page: 1});

    setListCountries(
      res?.map((item: any) => ({
        label: item?.name,
        value: item?.id,
      }))
    );
  };

  const fetchListCities = async (countryId: any) => {
    const res = await fetchCities(countryId)
    setListCities(
      res?.map((item: any) => ({
        label: item?.name,
        value: item?.id,
      }))
    );
  };

  useEffect(() => {
    fetchListCountries()
  }, [])

  useEffect(() => {
    fetchListCities(item?.countryId)
  }, [item?.countryId])
 
  return (
    <div style={{display: "flex", alignItems: "center"}} key={item?.id}>
      <div style={{width: "120px"}}>
        <Select 
            placeholder="select" 
            options={listCountries}
            value={item?.countryId || 1}
            onChange={(value) => onChangeOptionLocation && onChangeOptionLocation(value, 'countryId' , item.id)}  
        />
      </div>
      <div style={{width: "200px"}}>
         <Select 
            placeholder="select" 
            options={listCities}
            value={item?.cityId}
            onChange={(value) => onChangeOptionLocation && onChangeOptionLocation(value, 'cityId' , item.id)}  
         />
      </div>
      <div style={{flex: 1}}>
        <Input 
            value={item.address} 
            onChange={(e:ChangeEvent<HTMLInputElement>) => onChangeOptionLocation && onChangeOptionLocation(e.target.value, "address" , item.id)}
        />
      </div>
      {companyAddresses?.length > 1 && (
        <span 
            onClick={() => handleClearOptionLocation && handleClearOptionLocation(item?.id)} 
            style={{color: "#1677ff", fontSize: "20px", marginLeft: "10px"}}>X</span>
      )}
    </div>
  );
};
