import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faTimes } from '@fortawesome/free-solid-svg-icons';

function SearchFilter(props) {
    const [selectedCity, setCity] = useState("台北市");
    const [districtAnimation, setDistrictAnimation] = useState("");
    const [districtInputState, setDistrictInputState] = useState({ button: "", input: "" });
    const { setFilterState } = props;

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

    function toggleDistricts() {
        if (!districtInputState.button) {
            setDistrictInputState({
                button: "search-filter__district-button--clicked",
                input: "search-filter__district-input--show"
            });
        } else {
            setDistrictInputState({ button: "", input: "" });
        };
    };

    function districtSelection() {
        const districts = {
            /* 北部 */
            "台北市": ["中山區", "大安區", "信義區", "內湖區", "士林區", "中正區", "萬華區", "松山區", "大同區", "北投區", "文山區", "南港區"],
            "新北市": ["板橋區", "三重區", "中和區", "淡水區", "新莊區", "永和區", "汐止區", "新店區", "林口區", "蘆洲區", "土城區", "三峽區",
                "樹林區", "鶯歌區", "泰山區", "五股區", "八里區", "深坑區", "三芝區", "萬里區", "瑞芳區", "金山區", "烏來區", "平溪區", "石碇區",
                "貢寮區", "雙溪區", "坪林區", "石門區"],
            "桃園市": ["桃園區", "中壢區", "蘆竹區", "龜山區", "八德區", "平鎮區", "大園區", "楊梅區", "觀音區", "龍潭區", "大溪區", "新屋區",
                "復興區"],
            "新竹市": ["東區", "北區", "香山區"],
            "新竹縣": ["竹北市", "湖口鄉", "新豐鄉", "竹東鎮", "寶山鄉", "芎林鄉", "新埔鎮", "橫山鄉", "關西鎮", "五峰鄉", "尖石鄉", "北埔鄉",
                "峨嵋鄉"],
            "基隆市": ["中正區", "仁愛區", "安樂區", "信義區", "中山區", "七堵區", "暖暖區"],
            "宜蘭縣": ["宜蘭市", "羅東鎮", "礁溪鄉", "蘇澳鎮", "頭城鎮", "冬山鄉", "五結鄉", "壯圍鄉", "三星鄉", "員山鄉", "大同鄉", "南澳鄉"],
            /* 中部 */
            "台中市": ["西屯區", "北區", "北屯區", "西區", "南屯區", "南區", "東區", "龍井區", "太平區", "大里區", "中區", "沙鹿區", "豐原區",
                "大雅區", "清水區", "潭子區", "霧峰區", "后里區", "梧棲區", "烏日區", "神岡區", "大甲區", "大肚區", "外埔區", "東勢區", "新社區",
                "石岡區", "和平區", "大安區"],
            "彰化縣": ["彰化市", "員林市", "鹿港鎮", "大村鄉", "和美鎮", "伸港鄉", "溪湖鎮", "北斗鎮", "秀水鄉", "二林鎮", "花壇鄉", "田中鎮",
                "溪州鄉", "埤頭鄉", "社頭鄉", "福興鄉", "線西鄉", "埔鹽鄉", "埔心鄉", "芳苑鄉", "二水鄉", "永靖鄉", "田尾鄉", "芬園鄉", "竹塘鄉",
                "大城鄉"],
            "苗栗縣": ["竹南鎮", "頭份市", "苗栗市", "苑裡鎮", "後龍鎮", "銅鑼鄉", "造橋鄉", "公館鄉", "三義鄉", "大湖鄉", "三灣鄉", "南庄鄉",
                "獅潭鄉", "通霄鎮", "頭屋鄉", "泰安鄉", "西湖鄉", "卓蘭鎮"],
            "雲林縣": ["斗六市", "虎尾鎮", "斗南鎮", "北港鎮", "麥寮鄉", "西螺鎮", "東勢鄉", "古坑鄉", "崙背鄉", "土庫鎮", "水林鄉", "莿桐鄉",
                "元長鄉", "口湖鄉", "二崙鄉", "臺西鄉", "褒忠鄉", "大埤鄉", "林內鄉", "四湖鄉"],
            "南投縣": ["南投市", "草屯鎮", "埔里鎮", "竹山鎮", "鹿谷鄉", "水里鄉", "名間鄉", "中寮鄉", "仁愛鄉", "魚池鄉", "集集鎮", "國姓鄉",
                "信義鄉"],
            /* 南部 */
            "高雄市": ["三民區", "苓雅區", "左營區", "楠梓區", "鳳山區", "前鎮區", "鼓山區", "新興區", "小港區", "前金區", "鹽埕區", "大社區",
                "大寮區", "岡山區", "仁武區", "橋頭區", "鳥松區", "燕巢區", "林園區", "湖內區", "路竹區", "大樹區", "旗津區", "茄萣區", "旗山區",
                "梓官區", "美濃區", "杉林區", "阿蓮區", "永安區", "田寮區","彌陀區", "六龜區", "內門區", "甲仙區", "桃源區", "那瑪夏區", "茂林區"],
            "台南市": ["永康區", "東區", "北區", "中西區", "安平區", "仁德區", "南區", "安南區", "新市區", "善化區", "新營區", "歸仁區", "麻豆區",
                "佳里區", "柳營區", "六甲區", "新化區", "鹽水區", "玉井區", "安定區", "官田區", "西港區", "白河區", "下營區", "後壁區", "七股區",
                "學甲區", "楠西區", "山上區", "左鎮區", "南化區", "關廟區", "龍崎區", "將軍區", "北門區", "東山區", "大內區"], 
            "嘉義市": ["西區", "東區"],
            "屏東縣": ["屏東市", "內埔鄉", "東港鎮", "潮州鎮", "恆春鎮", "長治鄉", "鹽埔鄉", "車城鄉", "九如鄉", "萬丹鄉", "林邊鄉", "萬巒鄉",
                "枋寮鄉", "滿州鄉", "新園鄉", "南州鄉", "里港鄉", "崁頂鄉", "三地門鄉", "霧臺鄉", "瑪家鄉", "高樹鄉", "麟洛鄉", "竹田鄉", "泰武鄉",
                "來義鄉", "新埤鄉", "琉球鄉", "佳冬鄉", "枋山鄉", "春日鄉", "獅子鄉", "牡丹鄉"],
            "嘉義縣": ["民雄鄉", "大林鎮", "太保市", "朴子市", "水上鄉", "梅山鄉", "番路鄉", "竹崎鄉", "新港鄉", "布袋鎮", "東石鄉", "中埔鄉",
                "阿里山鄉", "大埔鄉", "鹿草鄉", "六腳鄉", "溪口鄉", "義竹鄉"],
            /* 東部/離島 */
            "花蓮縣": ["花蓮市", "吉安鄉", "新城鄉", "壽豐鄉", "玉里鎮", "光復鄉", "瑞穗鄉", "秀林鄉", "鳳林鎮", "豐濱鄉", "萬榮鄉", "卓溪鄉",
                "富里鄉"],
            "台東縣": ["台東市", "卑南鄉", "東河鄉", "成功鎮", "池上鄉", "海端鄉", "綠島鄉", "蘭嶼鄉", "延平鄉", "鹿野鄉", "關山鎮", "長濱鄉",
                "太麻里鄉", "金峰鄉", "大武鄉", "達仁鄉"],
            "金門縣": ["金城鎮", "金寧鄉", "金湖鎮", "金沙鎮", "烈嶼鄉", "烏坵鄉"],
            "澎湖縣": ["馬公市", "西嶼鄉", "望安鄉", "七美鄉", "白沙鄉", "湖西鄉"],
            "連江縣": ["南竿鄉", "北竿鄉", "莒光鄉", "東引鄉", "東沙", "南沙"]
        };

        if (!districts[selectedCity]) return null;

        return (
            <div className="search-filter__input">
                <div className="search-filter__district-header">鄉鎮
                    <button 
                        className="search-filter__district-button"
                        type="button"
                        onClick={toggleDistricts}
                        aria-label="顯示鄉鎮選項"
                        aria-pressed="false"
                    >
                        <div className={`search-filter__district-button-icon ${districtInputState.button}`}>
                            <FontAwesomeIcon
                                icon={faSortUp}
                                rotation={90}
                                transform="left-3 down-1.3"
                            />
                        </div>
                    </button>
                </div>
                <div className={`search-filter__district-input ${districtInputState.input}`}>
                    {
                        districts[selectedCity].map((district, i) => {
                            return (
                                <div
                                    key={selectedCity + district}
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
                <h3>租屋條件選擇</h3>
                <button 
                    className="search-filter__close" 
                    type="button"
                    aria-label="關閉"
                    onClick={() => { setFilterState("rental-listings__modal--hide"); }}
                >
                    <FontAwesomeIcon
                        icon={faTimes}
                    />
                </button>
            </div>
            { citySelection() }
            { districtSelection() }
            <div className="search-filter__input">
                <label htmlFor="propertyType">租屋類型</label>
                <select
                    id="propertyType"
                    name="propertyType"
                >
                    <option value="">不限</option>
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
                    <option value="">不限</option>
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
            <div className="search-filter__input">月租
                <div>
                    最低
                    <input
                        className="rental-listings__rent-input"
                        id="rent-min"
                        placeholder="不限"
                        type="number"
                        autoComplete="off"
                        name="min"
                        // onChange={handleRentInput}
                        // value={rentLimit.min}
                    ></input>元 - 最高
                    <input
                        className="rental-listings__rent-input"
                        id="rent-max"
                        placeholder="不限"
                        type="number"
                        autoComplete="off"
                        name="max"
                        // onChange={handleRentInput}
                        // value={rentLimit.max}
                    ></input>元
                    <div>
                        <span style={{ color: "crimson" }}>!</span>
                        最高租金不能低於最低租金
                        <span style={{ color: "crimson" }}>!</span>
                    </div>
                </div>
            </div>
            <div className="search-filter__input">坪數
                <div>
                    最低
                    <input
                        className="rental-listings__rent-input"
                        id="rent-min"
                        placeholder="不限"
                        type="number"
                        autoComplete="off"
                        name="min"
                    // onChange={handleRentInput}
                    // value={rentLimit.min}
                    ></input>坪 - 最高
                    <input
                        className="rental-listings__rent-input"
                        id="rent-max"
                        placeholder="不限"
                        type="number"
                        autoComplete="off"
                        name="max"
                    // onChange={handleRentInput}
                    // value={rentLimit.max}
                    ></input>坪
                    <div>
                        <span style={{ color: "crimson" }}>!</span>
                        最高坪數不能低於最低坪數
                        <span style={{ color: "crimson" }}>!</span>
                    </div>
                </div>
            </div>
            <div className="search-filter__submit">
                <button className="search-filter__confirm-button" type="button">確定</button>
                <button 
                    type="button" 
                    onClick={() => { setFilterState("rental-listings__modal--hide"); }}
                >取消</button>
            </div>
        </div>
    );
};

export default SearchFilter;