const Header_features = ({ onFeatureSelect }) => {
    return (
        <div className="header-features">
            <button className="header-features-item"  onClick={() => onFeatureSelect("friend-suggest")}>
                Gợi ý kết bạn
            </button>
            <button className="header-features-item">
                <span>Tin nhắn</span>
            </button>
        </div>
    );
}

export default Header_features;