function code=train(filename)
[s, fs] = audioread(filename);
v = findmfcc(s, fs);  

%SPLITTING PARAMETER OF CENTROIDS
e = 0.0001;
codebk = mean(v, 2);
distortion = int32(inf);             
num_of_centroids = int32(log2(16));

for i=1:num_of_centroids
    %SPLITTING OF CENTROIDS
    codebk = [codebk*(1+e), codebk*(1-e)];
    
    %INFINITE LOOP TILL CONDITION MET
    while(1==1)
        
        %DIST OF EACH POINT TO EACH CODEWORD
        dist = distance(v, codebk);         
        
        %MAPPING POINTS IN D CLOSEST TO CENTROID
        [m,ind] = min(dist, [], 2);          
        t = 0;
        
        lim = 2^i;
        for j=1:lim
            %UPDATING CENTROIDS
            codebk(:, j) = mean(v(:, ind==j), 2);
            %CLUSTER OF NEIGHBORING POINTS OF THE CENTROID
            x = distance(v(:, ind==j), codebk(:, j));
            len = length(x);                       
            
            for q = 1:len
                t = t + x(q);
            end
        end
        if (((distortion - t)/t) < e)       % distortion condition breaks the loop
            break;
        else
            distortion = t;
        end
    end
end
disp(codebk);
code=codebk;
end



