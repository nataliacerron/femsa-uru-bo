
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

function Construction() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

    return (
        <div className="flex flex-col flex-1 items-center justify-center p-16" style={{ backgroundColor: 'white' }}>
            <div className="w-full max-w-3xl text-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <img
                        src="assets/images/logo/canalCOCA-logo.png"
                        alt="Logo Coca"
                        width="80%"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                >
                    <Typography
                        variant="h1"
                        className="mt-48 sm:mt-96 text-4xl md:text-7xl font-extrabold tracking-tight leading-tight md:leading-none text-center"
                    >
                        Sección en desarrollo, se habilitara muy pronto!
                    </Typography>
                </motion.div>


                <Link className="block font-normal mt-48" to="/">
                    Volver
                </Link>
            </div>
        </div>
    );
}

export default Construction;
