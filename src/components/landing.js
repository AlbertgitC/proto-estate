import { useEffect, useState } from 'react';


function Landing(props) {
    const initialState = { imgUrl: "", title: "", content: "", component: null };
    const [state, setState] = useState(initialState);

    useEffect(() => {
        import(`../images/${props.imgFileName}`)
            .then(res => {
                setState(s => ({ ...s, imgUrl: res.default }));
            })
            .catch(err => console.log(err));

        for (let prop in props) {
            setState(s => ({ ...s, [prop]: props[prop] }));
        };
    }, [props]);

    return (
        <div className="landing" style={{backgroundImage: `url(${state.imgUrl})`}}>
            <div className="landing__over-lay">
                <h1 className="landing__title">{state.title}</h1>
                <p className="landing__content">{state.content}</p>
                {state.component}
            </div>
        </div>
    );
};

export default Landing;