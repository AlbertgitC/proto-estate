

function Footer() {
    const footerMenu = ["關於我們", "投資者專區", "廣告刊登", "交換連結", "新聞剪輯", 
        "社會公益", "免責聲明", "服務條款", "隱私權聲明", "數字經銷商"];
    return (
        <div className="footer">
            <ul className="footer__ul">
                {footerMenu.map((item, i) => (
                    <li key={i} className="footer__li">{item}</li>
                ))}
            </ul>
            <p className="footer__content">來裡算自學，的書對快？現動的供基賽微司結西顯少活舞媽很香書小食於火電只生廣見
                光保明們，去克就防呢無用：代年界一他活。為接西戰事，請各者史態黑美在族景象
                子、加這情為才運愛。</p>
        </div>
    );
}

export default Footer;