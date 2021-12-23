import { useCallback, useEffect, useState } from "react";
import useJesusPunks from "../useJesusPunks";

//Plural Sintaxis
const getPunkData = async ({jesusPunks, tokenId}) => {
    const [
        tokenURI,
        dna, 
        owner,
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
        jesusPunks.methods.tokenURI(tokenId).call(),
        jesusPunks.methods.tokenDNA(tokenId).call(),
        jesusPunks.methods.ownerOf(tokenId).call(),
        jesusPunks.methods.getAccessoriesType(tokenId).call,
        jesusPunks.methods.getClotheColor(tokenId).call,
        jesusPunks.methods.getClotheType(tokenId).call,
        jesusPunks.methods.getEyeType(tokenId).call,
        jesusPunks.methods.getEyeBrowType(tokenId).call,
        jesusPunks.methods.getFacialHairColor(tokenId).call,
        jesusPunks.methods.getFacialHairType(tokenId).call,
        jesusPunks.methods.getHairColor(tokenId).call,
        jesusPunks.methods.getHatColor(tokenId).call,
        jesusPunks.methods.getGraphicType(tokenId).call,
        jesusPunks.methods.getMouthType(tokenId).call,
        jesusPunks.methods.getSkinColor(tokenId).call,
        jesusPunks.methods.getTopType(tokenId).call,

    ]);

    const responseMetadata= await fetch(tokenURI);
    const metadata = await responseMetadata.json();

    return {
        tokenId,
        atributes: {
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

const useJesusPunksData = () => {
    const [punks, setPunks] = useState([]);
    const [loading, setLoading] = useState(true);
    const jesusPunks = useJesusPunks()

    const update = useCallback( async ()=>{
        if(jesusPunks){
            setLoading(true);

            let tokenIds;

            const totalSupply = await jesusPunks.methods.totalSupply().call();
            tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index);

            const punksPromise = tokenIds.map((tokenId) => 
                getPunkData({ tokenId, jesusPunks })
            );

            const punks = await Promise.all(punksPromise);

            setPunks(punks);
            setLoading(false);
        }
    }, [jesusPunks]);

    useEffect(() => {
        update();
    }, [update]);

    return {
        loading,
        punks,
        update,
    }
};

export { useJesusPunksData };