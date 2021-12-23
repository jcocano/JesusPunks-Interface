import { useWeb3React } from '@web3-react/core';
import { Grid } from '@chakra-ui/react';
import Loading from '../../components/loading';
import PunkCard from '../../components/punk-card';
import RequestAccess from '../../components/request-access';
import { useJesusPunksData } from '../../hooks/useJesusPunksData';

const Punks = () => {
    const { active } = useWeb3React();
    const { punks, loading } = useJesusPunksData();

    if (!active) return <RequestAccess/>



    return (
        <>
        {
            loading ?
            <Loading/> :
            <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
                {punks.map(({ name, image, tokenId}) => (
                    <PunkCard key={tokenId} image={image} name={name}/>
                    ))}
            </Grid>
        }
        </>
    );
};

export default Punks;