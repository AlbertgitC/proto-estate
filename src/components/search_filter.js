import { useState } from 'react';

function SearchFilter() {
    const [selectedCity, setCity] = useState("台北市");
    const [districtAnimation, setDistrictAnimation] = useState("");

    function handleCitySelect(e) {
        if (selectedCity === e.target.value) return;
        setCity(e.target.value);
        setDistrictAnimation("search-filter__district-item--animation");
        setTimeout(() => {
            setDistrictAnimation("");
        }, 900);
    };

    function citySelection() {
        const cities = {
            "北部": ["台北市", "新北市", "桃園市", "新竹市", "新竹縣", "基隆市", "宜蘭縣"],
            "中部": ["台中市", "彰化縣", "苗栗縣", "雲林縣", "南投縣"],
            "南部": ["高雄市", "台南市", "嘉義市", "屏東縣", "嘉義縣"],
            "東部/離島": ["花蓮縣", "台東縣", "金門縣", "澎湖縣", "連江縣"]
        };

        return (
            <div className="search-filter__input">
                <label htmlFor="city">城市</label>
                <select
                    id="city"
                    name="city"
                    onChange={handleCitySelect}
                >
                    <option disabled>北部</option>
                    {
                        cities["北部"].map((city, i) => {
                            return (<option key={i} value={city}>{city}</option>);
                        })
                    }
                    <option disabled>中部</option>
                    {
                        cities["中部"].map((city, i) => {
                            return (<option key={i} value={city}>{city}</option>);
                        })
                    }
                    <option disabled>南部</option>
                    {
                        cities["南部"].map((city, i) => {
                            return (<option key={i} value={city}>{city}</option>);
                        })
                    }
                    <option disabled>東部/離島</option>
                    {
                        cities["東部/離島"].map((city, i) => {
                            return (<option key={i} value={city}>{city}</option>);
                        })
                    }
                </select>
            </div>
        );
    };

    function districtSelection() {
        const districts = {
            "台北市": ["中山區", "大安區", "信義區", "內湖區", "士林區", "中正區", "萬華區", "松山區", "大同區", "北投區", "文山區", "南港區"],
            "新北市": ["板橋區", "三重區", "中和區", "淡水區", "新莊區", "永和區", "汐止區", "新店區", "林口區", "蘆洲區", "土城區", "三峽區",
                "樹林區", "鶯歌區", "泰山區", "五股區", "八里區", "深坑區", "三芝區", "萬里區", "瑞芳區", "金山區", "烏來區", "平溪區", "石碇區",
                "貢寮區", "雙溪區", "坪林區", "石門區"]
        };

        if (!districts[selectedCity]) return null;

        return (
            <div className="search-filter__input">鄉鎮
                <div className="search-filter__district-input">
                    {
                        districts[selectedCity].map((district, i) => {
                            return (
                                <div
                                    key={i}
                                    className={`search-filter__district-item ${districtAnimation}`}
                                    style={{ animationDelay: `${i * 20}ms` }}
                                >
                                    <input type="checkbox" id={district} name="district" value={district} />
                                    <label htmlFor={district}>{district}</label>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    };

    return (
        <div className="search-filter">
            <div className="search-filter__header">
                <h3>Filter</h3>
                <p>X</p>
            </div>
            { citySelection() }
            { districtSelection() }
            <div className="search-filter__input">
                <label htmlFor="propertyType">類型</label>
                <select
                    id="propertyType"
                    name="propertyType"
                >
                    <option value="" disabled>Testing</option>
                    <option value="" disabled hidden>選擇類型</option>
                    <option value="整層住家">整層住家</option>
                    <option value="獨立套房">獨立套房</option>
                    <option value="分租套房">分租套房</option>
                    <option value="雅房">雅房</option>
                </select>
            </div>
            <div className="search-filter__input">
                <label htmlFor="numberRooms">格局</label>
                <select
                    id="numberRooms"
                    name="numberRooms"
                >
                    <option value="" disabled hidden>選擇格局</option>
                    <option value="1">1房</option>
                    <option value="2">2房</option>
                    <option value="3">3房</option>
                    <option value="4">4房</option>
                    <option value="5">5房</option>
                    <option value="6">6房</option>
                    <option value="7">7房</option>
                    <option value="8">8房</option>
                </select>
            </div>
            <div className="search-filter__input">
                <label htmlFor="areaPin">坪數</label>
                <input
                    id="areaPin"
                    type="number"
                    name="areaPin"
                    placeholder="坪數"
                    autoComplete="off"
                />
            </div>
            <div>
                <p>Error</p>
            </div>
            <div>
                <button>確定</button>
            </div>
        </div>
    );
};

export default SearchFilter;