import { useEffect, useState } from 'react';


function Landing(props) {
    const initialState = { imgUrl: "", title: "", content: "" };
    const [state, setState] = useState(initialState);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            import(`../images/${props.imgFileName}`)
                .then(res => {
                    setState(s => ({ ...s, imgUrl: res.default }));
                })
                .catch(err => console.log(err));

            for (let prop in props) {
                setState(s => ({ ...s, [prop]: props[prop] }));
            };
        };
        return () => (isSubscribed = false);
    }, [props]);

    return (
        <div className="landing" style={{ backgroundImage: `url(${state.imgUrl})` }}>
            <h1 className="landing__title">{state.title}</h1>
            <p className="landing__content">{state.content}</p>
            {props.children}
        </div>
    );
};

export default Landing;