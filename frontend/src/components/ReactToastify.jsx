import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ReactToastify() {

        const config = {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        };

        return (
            <div>
                <ToastContainer {...config} />
            </div>
        );
}

export default ReactToastify;