function c=findmfcc(s,fs)
%FRAME SIZE
frame_size = 256;

%DISTANCE BETWEEN FRAMES
dist_bw_frames = 100; 

%LENGTH OF INPUT MATRIX
sig_len = length(s);

%NUMBER OF FRAMES
number_of_frames = 1 + floor((sig_len - frame_size)/double(dist_bw_frames));

%VECTOR OF FRAME VECTORS
mat = zeros(frame_size, number_of_frames);

for i=1:number_of_frames
    index = 100*(i-1) + 1;
    for j=1:frame_size
        mat(j,i) = s(index);
        index = index + 1;
    end
end

%FINDING HAMMING WINDOW
hamming_window = hamming(frame_size);              
after_window = diag(hamming_window)*mat;

%FINDING FAST FOURIER TRANSFORM IN FREQUENCY DOMAIN
freq_domain = fft(after_window);

%FIND THE MEL SPACED FILTERBANK
num_of_filter=20;

f0 = 700 / fs;
fn2 = floor(frame_size/2);

lr = log(1 + 0.5/f0)/(num_of_filter+1);

% CONVERT TO FFT BIN
bl = frame_size * (f0 * (exp([0 1 num_of_filter num_of_filter+1] * lr) - 1));

b1 = floor(bl(1)) + 1;
b2 = ceil(bl(2));
b3 = floor(bl(3));
b4 = min(fn2, ceil(bl(4))) - 1;

pf = log(1 + (b1:b4)/frame_size/f0) / lr;
fp = floor(pf);
pm = pf - fp;

r = [fp(b2:b4) 1+fp(1:b3)];
c = [b2:b4 1:b3] + 1;
v = 2 * [1-pm(b2:b4) pm(1:b3)];

filter_bank = sparse(r, c, v, num_of_filter, 1+fn2);


nby2 = 1 + floor(frame_size/2);

%MEL SPECTRUM
ms = filter_bank*abs(freq_domain(1:nby2,:)).^2;

%FINDING THE MEL FREQUENCY CEPSTRUM COEFFICIENTS
c = dct(log(ms));

%EXCLUDE 0th ORDER CEPSTRAL COEFFICIENT
c(1,:) = [];
end