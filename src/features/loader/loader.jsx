import "./loader.scss";
import Logo from "../../assets/logo1.svg";

export default function Loader({ width, height, type }) {
    let domain = [0, 0]
    if (type == "simple") {
        domain = [50, 30]
    }
    else if (type == "intro") {
        domain = [150, 120]
    }
    else {
        domain = [100, 70]
    }
    return <section id="loader" style={{
        width: width,
        height: height
    }} >
        <span style={{ width: domain[0], height: domain[0], borderWidth: type == "simple" ? 2 : 3 }}></span>
        <span style={{ width: domain[1], height: domain[1], borderWidth: type == "simple" ? 2 : 3 }}></span>
        {type == "intro" ? <img src={Logo} alt="" width={60} /> : null}
    </section>;
}