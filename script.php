<?php

// URL du fichier ZIP
$url = "https://simplemaps.com/static/data/world-cities/basic/simplemaps_worldcities_basicv1.76.zip";
$zipFile = "tempfile.zip";

// Dossier où le fichier CSV sera déplacé
$destinationDir = __DIR__ . "/frontend/public";

// Télécharger le fichier ZIP
$ch = curl_init($url);
$fp = fopen($zipFile, 'wb');
curl_setopt($ch, CURLOPT_FILE, $fp);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_exec($ch);
curl_close($ch);
fclose($fp);

// Ouvrir et extraire le ZIP
$zip = new ZipArchive;
if ($zip->open($zipFile) === TRUE) {
    $zip->extractTo(__DIR__);
    $zip->close();
    echo "Fichier ZIP extrait.\n";

    // Trouver le fichier CSV et le déplacer vers le dossier spécifié
    foreach (glob("*.csv") as $csvFile) {
        if (rename($csvFile, $destinationDir . "/" . $csvFile)) {
            echo "Fichier $csvFile déplacé avec succès vers $destinationDir.\n";
        } else {
            echo "Erreur lors du déplacement du fichier $csvFile.\n";
        }
    }
} else {
    echo "Erreur lors de l'ouverture du fichier ZIP.\n";
}
unlink($zipFile);

?>
