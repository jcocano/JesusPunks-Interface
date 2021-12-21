import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import JesusPunksArtifact from '../../config/web3/artifacts/JesusPunks';

const { address, abi } = JesusPunksArtifact;

const useJesusPunks = () =>{
    const {active, library, chainId } = useWeb3React();

    const jesusPunks = useMemo(() => {
        if (active) return new library.eth.Contract(abi, address[chainId]);
    }, [active, chainId, library?.eth?.Contract]);

    return jesusPunks;
};

export default useJesusPunks;