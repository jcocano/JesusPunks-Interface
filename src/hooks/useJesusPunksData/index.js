import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import useJesusPunks from "../useJesusPunks";

//URI Structure
const getPunkData = async ({jesusPunks, tokenId}) => {
    const [
        tokenURI,
        dna,
        owner,
        ] = await Promise.all([
        jesusPunks.methods.tokenURI(tokenId).call(),
        jesusPunks.methods.tokenDNA(tokenId).call(),
        jesusPunks.methods.ownerOf(tokenId).call(),
    ]);

    const [
        accessoriesType,
        clotheColor,
        clotheType,
        eyeType,
        eyeBrowType,
        facialHairColor,
        facialHairType,
        hairColor,
        hatColor,
        graphicType,
        mouthType,
        skinColor,
        topType,
      ] = await Promise.all([
        jesusPunks.methods.getAccessoriesType(dna).call(),
        jesusPunks.methods.getClotheColor(dna).call(),
        jesusPunks.methods.getClotheType(dna).call(),
        jesusPunks.methods.getEyeType(dna).call(),
        jesusPunks.methods.getEyeBrowType(dna).call(),
        jesusPunks.methods.getFacialHairColor(dna).call(),
        jesusPunks.methods.getFacialHairType(dna).call(),
        jesusPunks.methods.getHairColor(dna).call(),
        jesusPunks.methods.getHatColor(dna).call(),
        jesusPunks.methods.getGraphicType(dna).call(),
        jesusPunks.methods.getMouthType(dna).call(),
        jesusPunks.methods.getSkinColor(dna).call(),
        jesusPunks.methods.getTopType(dna).call(),
      ]);

    const responseMetadata= await fetch(tokenURI);
    const metadata = await responseMetadata.json();

    return {
        tokenId,
        attributes: {
            accessoriesType,
            clotheColor,
            clotheType,
            eyeType,
            eyeBrowType,
            facialHairColor,
            facialHairType,
            hairColor,
            hatColor,
            graphicType,
            mouthType,
            skinColor,
            topType,
        },
        tokenURI,
        dna,
        owner,
        ...metadata,
    }
};

// Plural Data
const useJesusPunksData = ({ owner = null } = {}) => {
    const [punks, setPunks] = useState([]);
    const { library } = useWeb3React()
    const [loading, setLoading] = useState(true);
    const jesusPunks = useJesusPunks()

    const update = useCallback( async ()=>{
        if(jesusPunks){
            setLoading(true);

            let tokenIds;

            if(!library.utils.isAddress(owner)){
                const totalSupply = await jesusPunks.methods.totalSupply().call();
                tokenIds = new Array(Number(totalSupply))
                .fill()
                .map((_, index) => index);
            }else{
                const balanceOf = await jesusPunks.methods.balanceOf(owner).call();

                const tokensIdsOfOwner = new Array(Number(balanceOf))
                    .fill()
                    .map((_, index) =>
                     jesusPunks.methods.tokenOfOwnerByIndex(owner, index).call()
                );

                tokenIds = await Promise.all(tokensIdsOfOwner)
            }

            const punksPromise = tokenIds.map((tokenId) => 
                getPunkData({ tokenId, jesusPunks })
            );

            const punks = await Promise.all(punksPromise);

            setPunks(punks);
            setLoading(false);
        }
    }, [jesusPunks, owner, library?.utils]);

    useEffect(() => {
        update();
    }, [update]);

    return {
        loading,
        punks,
        update,
    }
};

// Singular Data
const useJesusPunkData = (tokenId = null) => {
    const [punk, setPunk] = useState({ });
    const [loading, setLoading] = useState(true);
    const jesusPunks = useJesusPunks();

    const update = useCallback(async() =>{
        if (jesusPunks && tokenId != null){
            setLoading(true);

            const punk = await getPunkData({ jesusPunks,tokenId });
            setPunk(punk);

            setLoading(false);
        };
    }, [jesusPunks, tokenId]);

    useEffect(() => {
        update();
    }, [update]);

    return{
        loading,
        punk,
        update,
    };
};

export { useJesusPunksData, useJesusPunkData }